import { BookingDTO } from 'interfaces'
import * as React from 'react'

const weekday = ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT']

function selectDay (showDate) {
  const newDate = new Date(showDate)
  return newDate.getDay()
}
function formatDate (showDate) {
  const newDate = new Date(showDate)
  return newDate.toLocaleDateString()
}

function getDayType (booking) {
  if (booking.Performance1Time || booking.Performance2Time) {
    return 'Performance'
  }
  if (booking.RehearsalTown) {
    return 'Rehearsal'
  }
  return '-'
}

interface BookingDetailsListingPanelProps {
  bookings: BookingDTO[]
  activeContractIndex:number
  setActiveContractIndex: React.Dispatch<React.SetStateAction<number>>
}

const BookingDetailsListingPanel = ({
  bookings,
  setActiveContractIndex,
  activeContractIndex
}: BookingDetailsListingPanelProps) => {
  function handleContractChange (index) {
    setActiveContractIndex(index)
  }

  return (
    <div className="flex-col w-4/12 max-h-screen overflow-y-scroll">
      <h1 className="text-primary-pink mb-6">Week</h1>
      {bookings.length > 0 &&
          bookings.map((booking, idx) => {
            return (
              <div
                onClick={() => handleContractChange(idx)}
                key={booking.Id}
                className={`w-100 p-2 border-y-1 border-gray-300 
                    bg-none hover:bg-slate-300 odd:bg-slate-200 
                    cursor-pointer first-letter:`}
              >
                <div
                  onClick={() => handleContractChange(idx)}
                  className={`w-100 p-4 border-y-1 border-gray-300 ${
                    idx === activeContractIndex &&
                  'bg-blue-400 rounded-md text-white'

                  }
                    cursor-pointer `}
                >
                  <div className="flex flex-row justify-between ">
                    <div className="">-1</div>
                    <div className="">{weekday[selectDay(booking.Date)]}</div>
                    <div className="">
                      {booking.Date && formatDate(booking.Date)}
                    </div>
                    <div className="capitalize">{getDayType(booking)}</div>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}
export default BookingDetailsListingPanel
