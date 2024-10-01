import { VenueVenueTravelView } from 'prisma/generated/prisma-client';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unique } from 'radash';

export interface GapSuggestionParams {
  StartVenue: number;
  MinMins: number;
  MaxMins: number;
  MinMiles: number;
  MaxMiles: number;
  EndVenue: number;
}

export interface GapSuggestionUnbalancedProps {
  StartVenue: number;
  EndVenue: number;
  MinFromMiles?: number;
  MaxFromMiles?: number;
  MinToMiles?: number;
  MaxToMiles?: number;
  MinSeats?: number;
  MaxSeats?: number;
  MaxFromTime?: number;
  MaxToTime?: number;
  ExcludeLondonVenues?: boolean;
  IncludeExcludedVenues?: boolean;
}

export type VenueWithDistance = {
  VenueId: number;
  MileageFromStart: number;
  MileageFromEnd: number;
  Capacity?: number;
  MinsFromStart?: number;
  MinsFromEnd?: number;
};

export type GapSuggestionReponse = {
  VenueInfo?: VenueWithDistance[];
  DefaultMin: number;
  SliderMax: number;
  OriginalMiles: number;
  OriginalMins: number;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  let {
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
  } = req.body as GapSuggestionUnbalancedProps;
  const SLIDER_MIN = 25;

  try {
    const prisma = await getPrismaClient(req);
    const initial = await prisma.venueVenueTravelView.findMany({
      select: {
        Mileage: true,
        TimeMins: true,
      },
      where: {
        OR: [
          {
            AND: [{ Venue1Id: StartVenue }, { Venue2Id: EndVenue }],
          },
          {
            AND: [{ Venue1Id: EndVenue }, { Venue2Id: StartVenue }],
          },
        ],
      },
    });

    // Get default params if none provided
    const sliderMax = initial[0] ? Math.ceil((initial[0].Mileage * 1.5) / 10) * 10 : 200;

    // Incase we are dealing with really close venues
    const safeMin = sliderMax > SLIDER_MIN ? SLIDER_MIN : 0;

    if (!MinFromMiles) MinFromMiles = safeMin;
    if (!MaxFromMiles) MaxFromMiles = sliderMax;
    if (!MinToMiles) MinToMiles = safeMin;
    if (!MaxToMiles) MaxToMiles = sliderMax;

    const startVenue1Promise = prisma.venueVenueTravelView.findMany({
      where: {
        Venue1Id: StartVenue,
        Mileage: { gte: MinFromMiles, lte: MaxFromMiles },
        ...(MaxFromTime && { TimeMins: { lte: MaxFromTime } }),
      },
      select: {
        Venue2Id: true,
        TimeMins: true,
        Mileage: true,
      },
    });

    const startVenue2Promise = prisma.venueVenueTravelView.findMany({
      where: {
        Venue2Id: StartVenue,
        Mileage: { gte: MinFromMiles, lte: MaxFromMiles },
        ...(MaxFromTime && { TimeMins: { lte: MaxFromTime } }),
      },
      select: {
        Venue1Id: true,
        TimeMins: true,
        Mileage: true,
      },
    });

    const endVenue1Promise = prisma.venueVenueTravelView.findMany({
      where: {
        Venue1Id: EndVenue,
        Mileage: { gte: MinToMiles, lte: MaxToMiles },
        ...(MaxToTime && { TimeMins: { lte: MaxToTime } }),
      },
      select: {
        Venue2Id: true,
        TimeMins: true,
        Mileage: true,
      },
    });

    const endVenue2Promise = prisma.venueVenueTravelView.findMany({
      where: {
        Venue2Id: EndVenue,
        Mileage: { gte: MinToMiles, lte: MaxToMiles },
        ...(MaxToTime && { TimeMins: { lte: MaxToTime } }),
      },
      select: {
        Venue1Id: true,
        TimeMins: true,
        Mileage: true,
      },
    });

    const [startVenue1, startVenue2, endVenue1, endVenue2] = await Promise.all([
      startVenue1Promise,
      startVenue2Promise,
      endVenue1Promise,
      endVenue2Promise,
    ]);

    // Combine the venue ids and mileages
    const startVenueRelations = [
      ...startVenue1.map((v: VenueVenueTravelView) => ({ VenueId: v.Venue2Id, Mileage: v.Mileage, Mins: v.TimeMins })),
      ...startVenue2.map((v: VenueVenueTravelView) => ({ VenueId: v.Venue1Id, Mileage: v.Mileage, Mins: v.TimeMins })),
    ];
    const endVenueRelations = [
      ...endVenue1.map((v: VenueVenueTravelView) => ({ VenueId: v.Venue2Id, Mileage: v.Mileage, Mins: v.TimeMins })),
      ...endVenue2.map((v: VenueVenueTravelView) => ({ VenueId: v.Venue1Id, Mileage: v.Mileage, Mins: v.TimeMins })),
    ];

    // Create a Map for endVenueRelations
    const endVenueRelationsMap = new Map();
    for (const relation of endVenueRelations) {
      endVenueRelationsMap.set(relation.VenueId, { Mileage: relation.Mileage, Mins: relation.Mins });
    }

    // Find intersection of two sets (O(n))
    const venuesWithDistanceData = startVenueRelations
      .filter((startRelation) => endVenueRelationsMap.has(startRelation.VenueId))
      .map((startRelation) => ({
        VenueId: startRelation.VenueId,
        MileageFromStart: startRelation.Mileage,
        MileageFromEnd: endVenueRelationsMap.get(startRelation.VenueId).Mileage,
        MinsFromStart: startRelation.Mins,
        MinsFromEnd: endVenueRelationsMap.get(startRelation.VenueId).Mins,
      }));
    const VenueIds = unique(venuesWithDistanceData.map((x) => x.VenueId));
    const capacities = await prisma.venue.findMany({
      select: {
        Id: true,
        Seats: true,
        Name: true,
        ExcludeFromChecks: true,
        VenueAddress: {
          where: {
            TypeName: 'main',
          },
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
        Id: {
          in: VenueIds,
        },
      },
    });
    const capacityMap = new Map<number, any>(
      capacities.map((venue: any) => [
        venue.Id,
        {
          Seats: venue.Seats,
          Address: venue.VenueAddress?.[0],
          Name: venue.Name,
          ExcludeFromChecks: venue.ExcludeFromChecks,
        },
      ]),
    );
    const VenueInfo = venuesWithDistanceData
      .map((x) => {
        const { Seats, Address = {}, Name, ExcludeFromChecks } = capacityMap.get(x.VenueId) || {};
        if (Address.Town === 'London' && ExcludeLondonVenues) return null;
        if (!IncludeExcludedVenues && ExcludeFromChecks) return null;
        return { ...x, Capacity: Seats, ...Address, Name };
      })
      .filter((venue) => venue && venue.Capacity >= MinSeats && venue.Capacity <= MaxSeats);
    const result: GapSuggestionReponse = {
      SliderMax: sliderMax,
      DefaultMin: safeMin,
      OriginalMiles: initial[0] ? initial[0].Mileage : undefined,
      OriginalMins: initial[0] ? initial[0].TimeMins : undefined,
      VenueInfo,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error calculating gap suggestion' });
  }
}
