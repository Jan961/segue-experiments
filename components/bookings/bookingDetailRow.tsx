import * as React from "react";
import { dateService } from "../../services/dateService";

export default function BookingDetailRow(booking) {
  // const date = dateService.dateToSimple(booking.booking.ShowDate);
  let date = new Date(booking.booking.ShowDate);
  let options = {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  };
  // @ts-ignore
  let ShowDate = date.toLocaleString("en-GB", options);
  const day = dateService.getWeekDay(date);

  let week = dateService.weeks(
    booking.booking.Tour.TourStartDate,
    booking.booking.ShowDate
  );
  return (
    <>
      <div className="grid gap-1 grid-cols-10 border-b-2 border-gray-300 py-3 w-full">
        <div className="font-bold text-soft-primary-grey col-span-1 max-w-[50px]">
          {week}
        </div>
        <div className="col-span-3 font-medium text-soft-primary-grey max-w-[150px]">
          {day} &nbsp; {ShowDate}
        </div>
  
        <div className="flex flex-col col-start-5 col-end-11"> {/* Added col-start-5 and col-end-11 */}
          <div className="capitalize font-medium flex">
            {booking.booking.DateType.Name}
          </div>
          {booking.booking.Venue != null ? (
            <div className="flex flex-col">
              <div className="font-medium mb-1 flex">
                {booking.booking.Venue.Name} ({booking.booking.Venue.Town})
              </div>
              <div className="flex flex-wrap items-center space-x-4"> {/* Changed flex-row to flex-wrap and added space-x-4 */}
                <div>Seats: {booking.booking.Venue.Seats}</div>
                <span>|</span>
                <div>
                  Performances: {booking.booking.PerformancesPerDay}
                </div>
                <span>|</span>
                <div>Miles: 144</div>
                <span>|</span>
                <div>Time: 1:22</div>
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
