export interface AddBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
  performanceTimes: string[];
  DateTypeId?: number;
  BookingStatus: string;
  PencilNo: number;
  Notes: string;
  isBooking?: boolean;
  isRehearsal?: boolean;
  isGetInFitUp?: boolean;
  RunTag: string;
  // Add any additional fields needed for rehearsals and getInFitUp
}
