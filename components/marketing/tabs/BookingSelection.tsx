import React, { useEffect } from 'react'
import axios from 'axios'

type props = {
    venueCode:string;
    salesByType:string;
    showCode:string | string[];
    onClose:()=>void;
    onSubmit:(a:number[], b:any[])=>void
}

const BookingSelection = ({ onClose, salesByType, venueCode, showCode, onSubmit }:props) => {
  const [bookings, setBookings] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputs, setInputs] = React.useState<any>()
  useEffect(() => {
    const getBookingSelection = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post('/api/marketing/archivedSales/bookingSelection', { salesByType, venueCode, showCode })
        setBookings(data)
        setInputs(data.reduce((inputs, tour, i) => {
          inputs[tour.BookingId] = i + 1
          return inputs
        }, {}))
      } catch (error:any) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (salesByType && venueCode) {
      getBookingSelection()
    }
  }, [salesByType, venueCode])
  const handleOnSubmit = (e) => {
    e.preventDefault()
    const bookingIds = Object.keys(inputs)
      .sort((a, b) => inputs[a] - inputs[b])
      .filter(id => inputs[id])
      .map(id => parseInt(id, 10))
      .filter(id => id)
    const tours:any[] = bookingIds.map((bookingId:any) => bookings.find(booking => booking.BookingId === bookingId))
    onSubmit(bookingIds, tours)
    onClose()
  }
  const handleOnChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10)
    if (!isNaN(selectedValue)) {
      const inputWithSelectedValue:string = Object.keys(inputs).find((code:string) => inputs[code] === selectedValue)
      const targetInputValue = inputs[e.target.id]
      setInputs((prev) => ({
        ...prev,
        [e.target.id]: selectedValue,
        [inputWithSelectedValue]: targetInputValue
      }))
      return
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: null
    }))
  }
  return (<>
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
      &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="sm:flex justify-center">

            <div className="mt-3 justify-center text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-xl text-center leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                  Select Archived Tours for Display
              </h3>
            </div>
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => onClose()}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <form onSubmit={handleOnSubmit}>
            {
              bookings.map((booking, i) => (
                <div className="mt-6" key={i}>
                  <label htmlFor="date" className="text-lg font-medium">
                    {booking.FullTourCode}(WEEKS: {booking.TourLengthWeeks})
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={inputs?.[booking?.BookingId]}
                    id={booking.BookingId}
                    name={booking.BookingId}
                    onChange={handleOnChange}
                  >
                    <option value={null}>None</option>
                    {new Array(bookings.length).fill(0).map?.((_, j) => (
                      <option key={j} value={j + 1}>
                        {j + 1}
                      </option>
                    ))}
                  </select>

                </div>
              ))
            }
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => onClose()}
              >
                  Close and Discard
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>)
}

export default BookingSelection
