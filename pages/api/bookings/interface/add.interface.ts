export interface AddBookingsParams {
  BookingDate: string;
  DateBlockId: number;
  VenueId: number;
  Performances: any;
  DateTypeId?: number;
  StatusCode: string;
  PencilNum: number;
  Notes: string;
  isBooking?: boolean;
  isRehearsal?: boolean;
  isGetInFitUp?: boolean;
  RunTag: string;
  // Add any additional fields needed for rehearsals and getInFitUp
}
