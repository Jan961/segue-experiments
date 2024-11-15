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
  Name?: string;
  Town?: string;
  County?: string;
  Postcode?: string;
  Country?: string;
  Line1?: string;
  Line2?: string;
  Line3?: string;
};

export type GapSuggestionResponse = {
  VenueInfo?: VenueWithDistance[];
  DefaultMin: number;
  SliderMax: number;
  OriginalMiles: number;
  OriginalMins: number;
};
