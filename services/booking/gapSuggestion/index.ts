import { PrismaClient, VenueVenueTravelView } from 'prisma/generated/prisma-client';
import { unique } from 'radash';
import { GapSuggestionUnbalancedProps, GapSuggestionResponse, VenueWithDistance } from './types';

const SLIDER_MIN = 25;

export const calculateGapSuggestions = async (
  prisma: PrismaClient,
  params: GapSuggestionUnbalancedProps,
): Promise<GapSuggestionResponse> => {
  const {
    StartVenue,
    EndVenue,
    MinFromMiles,
    MaxFromMiles,
    MinToMiles,
    MaxToMiles,
    ExcludeLondonVenues,
    IncludeExcludedVenues,
    MinSeats = 0,
    MaxSeats = 0,
    MaxFromTime,
    MaxToTime,
  } = params;

  // Get initial venue travel data
  const initial = await prisma.venueVenueTravelView.findMany({
    select: {
      Mileage: true,
      TimeMins: true,
    },
    where: {
      OR: [
        { AND: [{ Venue1Id: StartVenue }, { Venue2Id: EndVenue }] },
        { AND: [{ Venue1Id: EndVenue }, { Venue2Id: StartVenue }] },
      ],
    },
  });

  // Calculate slider parameters
  const sliderMax = initial[0] ? Math.ceil((initial[0].Mileage * 1.5) / 10) * 10 : 200;
  const safeMin = sliderMax > SLIDER_MIN ? SLIDER_MIN : 0;

  // Set default distance parameters
  const normalizedParams = {
    MinFromMiles: MinFromMiles || safeMin,
    MaxFromMiles: MaxFromMiles || sliderMax,
    MinToMiles: MinToMiles || safeMin,
    MaxToMiles: MaxToMiles || sliderMax,
  };

  // Fetch venue relations
  const [startVenue1, startVenue2, endVenue1, endVenue2] = await Promise.all([
    getVenueRelations(
      prisma,
      StartVenue,
      true,
      normalizedParams.MinFromMiles,
      normalizedParams.MaxFromMiles,
      MaxFromTime,
    ),
    getVenueRelations(
      prisma,
      StartVenue,
      false,
      normalizedParams.MinFromMiles,
      normalizedParams.MaxFromMiles,
      MaxFromTime,
    ),
    getVenueRelations(prisma, EndVenue, true, normalizedParams.MinToMiles, normalizedParams.MaxToMiles, MaxToTime),
    getVenueRelations(prisma, EndVenue, false, normalizedParams.MinToMiles, normalizedParams.MaxToMiles, MaxToTime),
  ]);

  // Process venue relations
  const venuesWithDistanceData = processVenueRelations(startVenue1, startVenue2, endVenue1, endVenue2);

  // Get venue details
  const venueInfo = await enrichVenueData(prisma, venuesWithDistanceData, {
    ExcludeLondonVenues,
    IncludeExcludedVenues,
    MinSeats,
    MaxSeats,
  });

  return {
    SliderMax: sliderMax,
    DefaultMin: safeMin,
    OriginalMiles: initial[0]?.Mileage,
    OriginalMins: initial[0]?.TimeMins,
    VenueInfo: venueInfo,
  };
};

export const getVenueRelations = async (
  prisma: PrismaClient,
  venueId: number,
  isVenue1: boolean,
  minMiles: number,
  maxMiles: number,
  maxTime?: number,
): Promise<Partial<VenueVenueTravelView>[]> => {
  return prisma.venueVenueTravelView.findMany({
    where: {
      [isVenue1 ? 'Venue1Id' : 'Venue2Id']: venueId,
      Mileage: { gte: minMiles, lte: maxMiles },
      ...(maxTime && { TimeMins: { lte: maxTime } }),
    },
    select: {
      [isVenue1 ? 'Venue2Id' : 'Venue1Id']: true,
      TimeMins: true,
      Mileage: true,
    },
  });
};

export const processVenueRelations = (
  startVenue1: Partial<VenueVenueTravelView>[],
  startVenue2: Partial<VenueVenueTravelView>[],
  endVenue1: Partial<VenueVenueTravelView>[],
  endVenue2: Partial<VenueVenueTravelView>[],
): VenueWithDistance[] => {
  const startVenueRelations = [
    ...startVenue1.map((v) => ({ VenueId: v.Venue2Id, Mileage: v.Mileage, Mins: v.TimeMins })),
    ...startVenue2.map((v) => ({ VenueId: v.Venue1Id, Mileage: v.Mileage, Mins: v.TimeMins })),
  ];

  const endVenueRelations = [
    ...endVenue1.map((v) => ({ VenueId: v.Venue2Id, Mileage: v.Mileage, Mins: v.TimeMins })),
    ...endVenue2.map((v) => ({ VenueId: v.Venue1Id, Mileage: v.Mileage, Mins: v.TimeMins })),
  ];

  const endVenueRelationsMap = new Map(
    endVenueRelations.map((relation) => [relation.VenueId, { Mileage: relation.Mileage, Mins: relation.Mins }]),
  );

  return startVenueRelations.map((startRelation) => ({
    VenueId: startRelation.VenueId,
    MileageFromStart: startRelation.Mileage,
    MileageFromEnd: endVenueRelationsMap.get(startRelation.VenueId).Mileage,
    MinsFromStart: startRelation.Mins,
    MinsFromEnd: endVenueRelationsMap.get(startRelation.VenueId).Mins,
  }));
};

export const enrichVenueData = async (
  prisma: PrismaClient,
  venuesWithDistanceData: VenueWithDistance[],
  filters: {
    ExcludeLondonVenues?: boolean;
    IncludeExcludedVenues?: boolean;
    MinSeats: number;
    MaxSeats: number;
  },
): Promise<VenueWithDistance[]> => {
  const VenueIds = unique(venuesWithDistanceData.map((x) => x.VenueId));

  const capacities = await prisma.venue.findMany({
    select: {
      Id: true,
      Seats: true,
      Name: true,
      ExcludeFromChecks: true,
      VenueAddress: {
        where: { TypeName: 'main' },
        select: {
          TypeName: true,
          Line1: true,
          Line2: true,
          Line3: true,
          Town: true,
          County: true,
          Postcode: true,
          Country: true,
        },
      },
    },
    where: {
      Id: { in: VenueIds },
    },
  });

  const capacityMap = new Map(
    capacities.map((venue) => [
      venue.Id,
      {
        Seats: venue.Seats,
        Address: venue.VenueAddress?.[0],
        Name: venue.Name,
        ExcludeFromChecks: venue.ExcludeFromChecks,
      },
    ]),
  );

  return venuesWithDistanceData
    .map((venue) => {
      const venueData =
        capacityMap.get(venue.VenueId) ||
        ({} as { Seats: number; Address?: any; Name?: string; ExcludeFromChecks?: boolean });
      const { Seats, Address = {}, Name, ExcludeFromChecks } = venueData;

      if (Address.Town === 'London' && filters.ExcludeLondonVenues) return null;
      if (!filters.IncludeExcludedVenues && ExcludeFromChecks) return null;

      return {
        ...venue,
        Capacity: Seats,
        ...Address,
        Name,
      };
    })
    .filter(
      (venue) =>
        venue && venue.Capacity >= filters.MinSeats && (filters.MaxSeats === 0 || venue.Capacity <= filters.MaxSeats),
    );
};
