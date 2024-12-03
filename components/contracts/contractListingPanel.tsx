import { BookingWithVenueDTO } from 'interfaces';
import * as React from 'react';
import { calculateWeekNumber, getWeekDay, newDate } from 'services/dateService';

function formatDate(showDate) {
  const newDate = new Date(showDate);
  return newDate.toLocaleDateString();
}

interface BookingDetailsListingPanelProps {
  bookings: BookingWithVenueDTO[];
  activeContractIndex: number;
  setActiveContractIndex: React.Dispatch<React.SetStateAction<number>>;
}

const BookingDetailsListingPanel = ({
  bookings,
  setActiveContractIndex,
  activeContractIndex,
}: BookingDetailsListingPanelProps) => {
  function handleContractChange(index) {
    setActiveContractIndex(index);
  }

  const sortedBookings = bookings.sort((a, b) => {
    if (a.Date < b.Date) {
      return -1;
    }
    if (a.Date > b.Date) {
      return 1;
    }
    return 0; // a must be equal to b
  });

  return (
    <div className="flex-col w-6/12 lg:w-5/12 xl:w-4/12 max-h-screen overflow-y-scroll">
      <h1 className="text-primary-pink mt-4 mb-8 font-bold">Week</h1>
      {sortedBookings.length > 0 &&
        sortedBookings.map((booking, idx) => {
          return (
            <div
              onClick={() => handleContractChange(idx)}
              key={booking.Id}
              className={`p-2 mr-4 border-y border-gray-200 text-sm
                    
                  hover:bg-slate-300 bg-slate-200 odd:bg-opacity-0 
                    cursor-pointer bg-opacity-50`}
            >
              <div
                onClick={() => handleContractChange(idx)}
                className={`w-100 p-2 border-y-1 border-gray-300 ${
                  idx === activeContractIndex && 'bg-primary-pink rounded-md text-white'
                }
                    cursor-pointer `}
              >
                <div className="grid grid-cols-12 justify-between ">
                  <div className="col-span-1">
                    {calculateWeekNumber(newDate(bookings[0].Date), newDate(booking.Date))}
                  </div>
                  <div className="col-span-4">
                    {getWeekDay(booking.Date, 'short')}&nbsp;{formatDate(booking.Date)}
                  </div>
                  <div className="col-span-7">{booking?.Venue?.Name}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default BookingDetailsListingPanel;
