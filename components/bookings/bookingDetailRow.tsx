import * as React from "react";
import { dateService } from "../../services/dateService";

export default function BookingDetailRow(booking) {
  const date = dateService.dateToSimple(booking.booking.ShowDate);
  const day = dateService.getWeekDay(booking.booking.ShowDate);

  let week = dateService.weeks(
    booking.booking.Tour.TourStartDate,
    booking.booking.ShowDate
  );
  return (
    <>
      <div className="grid gap-1 grid-cols-10 border-b-2 border-gray-300 py-3 w-full">
        <div className="font-bold text-soft-primary-grey col-span-1">
          {week}
        </div>
        <div className="col-span-3 font-medium text-soft-primary-grey">
          {day} &nbsp; {date}
        </div>

        <div className="flex flex-row items-center justify-between">
  <div className="capitalize font-medium flex">
    {booking.booking.DateType.Name}
  </div>
  {booking.booking.Venue != null ? (
    <div className="ml-4 flex flex-col">
      <div className="flex flex-row">
        <div className="font-medium">{booking.booking.Venue.Name}</div>
        <div className="ml-2 text-gray-500">
          ({booking.booking.Venue.Town})
        </div>
      </div>
      <div className="flex flex-row">
        <div>Seats: {booking.booking.Venue.Seats}</div>
        <div className="ml-4">
          Performances: {booking.booking.PerformancesPerDay}
        </div>
      </div>
      <div className="flex flex-row">
        <div>Miles: 144</div>
        <div className="ml-4">Time: 1:22</div>
      </div>
    </div>
  ) : (
    <div></div>
  )}
</div>


        <div>{/* booking details */}</div>
      </div>
    </>
  );
}
