import { Venue, VenueAddress } from '@prisma/client';

export interface PrimaryAddress {
  primaryAddressId?: number;
  primaryAddress1?: string;
  primaryAddress2?: string;
  primaryAddress3?: string;
  primaryCountry?: string;
  primaryTown?: string;
  primaryPostCode?: string;
}

export interface DeliveryAddress {
  deliveryAddressId?: number;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  deliveryCountry?: string;
  deliveryTown?: string;
  deliveryPostCode?: string;
}

type UiVenueAddress = PrimaryAddress | DeliveryAddress;

export interface UiVenue {
  id?: number;
  venueCode: string;
  venueName: string;
  venueStatus: string;
  vatIndicator: boolean;
  culturallyExempt?: boolean;
  venueFamily: number;
  currency: string;
  venueCapacity: number;
  townPopulation: number;
  venueWebsite: string;
  notes: string;
  barringMiles: number;
  postShow: number;
  preShow: number;
  barringClause: string;
  confidentialNotes: string;
  soundDesk: string;
  soundNotes: string;
  techLXDesk: string;
  techLXNotes: string;
  stageSize: string;
  gridHeight: string;
  techSpecsUrl: string;
  flags: string;
  excludeFromChecks: boolean;
  what3WordsStage?: string;
  what3WordsLoading?: string;
}

export const trasformVenueAddress = (address?: VenueAddress): UiVenueAddress => {
  const { Id: id, Line1, Line2, Line3, TypeName, Town, Postcode, Country } = address || {};
  if (TypeName === 'Main') {
    return {
      primaryAddressId: id,
      primaryAddress1: Line1,
      primaryAddress2: Line2,
      primaryAddress3: Line3,
      primaryCountry: Country,
      primaryTown: Town,
      primaryPostCode: Postcode,
    };
  }
  return {
    deliveryAddressId: id,
    deliveryAddress1: Line1,
    deliveryAddress2: Line2,
    deliveryAddress3: Line3,
    deliveryCountry: Country,
    deliveryTown: Town,
    deliveryPostCode: Postcode,
  };
};

export type UiTransformedVenue = UiVenue & PrimaryAddress & DeliveryAddress;

export const transformVenues = (Venues: (Venue & { VenueAddress: VenueAddress[] })[]): UiTransformedVenue[] => {
  return Venues.map(
    ({
      Id: id,
      Name,
      Code,
      StatusCode,
      Website,
      CurrencyCode,
      VATIndicator,
      TechSpecsURL,
      Seats,
      BarringClause,
      TownPopulation,
      VenueAddress,
      LXDesk,
      LXNotes,
      SoundDesk,
      SoundNotes,
      StageSize,
      GridHeight,
      VenueFlags,
      BarringWeeksPre,
      BarringWeeksPost,
      BarringMiles,
      CulturallyExempt,
      FamilyId,
      VenueNotes,
      VenueWarningNotes,
      ExcludeFromChecks,
    }) => {
      const address1 = trasformVenueAddress(VenueAddress?.[0]) || {};
      const address2 = trasformVenueAddress(VenueAddress?.[1]) || {};
      return {
        id,
        venueCode: Code,
        venueName: Name,
        venueStatus: StatusCode,
        vatIndicator: VATIndicator,
        culturallyExempt: CulturallyExempt,
        venueFamily: FamilyId,
        currency: CurrencyCode,
        venueCapacity: Seats,
        townPopulation: TownPopulation,
        venueWebsite: Website,
        notes: VenueNotes,
        barringMiles: BarringMiles,
        postShow: BarringWeeksPost,
        preShow: BarringWeeksPre,
        barringClause: BarringClause,
        confidentialNotes: VenueWarningNotes,
        soundDesk: SoundDesk,
        soundNotes: SoundNotes,
        techLXDesk: LXDesk,
        techLXNotes: LXNotes,
        stageSize: StageSize,
        gridHeight: GridHeight,
        techSpecsUrl: TechSpecsURL,
        flags: VenueFlags,
        excludeFromChecks: ExcludeFromChecks,
        ...address1,
        ...address2,
      };
    },
  );
};
