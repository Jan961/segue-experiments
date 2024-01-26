import React, { useEffect } from 'react';
import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { Spinner } from 'components/global/Spinner';

type props = {
  venueCode: string;
  salesByType: string;
  showCode: string | string[];
  selectedBookingId: any;
  onClose: () => void;
  onSubmit: (a: number[], b: any[]) => void;
};

const BookingSelection = ({ onClose, salesByType, venueCode, showCode, selectedBookingId, onSubmit }: props) => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [inputs, setInputs] = React.useState<any>();
  useEffect(() => {
    const getBookingSelection = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post('/api/marketing/archivedSales/bookingSelection', {
          salesByType,
          venueCode,
          showCode,
        });
        setBookings(data);
        setInputs(
          data
            ?.sort((a, b) => (a.BookingId === selectedBookingId ? -1 : b.BookingId === selectedBookingId ? 1 : 0))
            .reduce((inputs, production, i) => {
              inputs[production.BookingId] = i + 1;
              return inputs;
            }, {}),
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (salesByType && venueCode) {
      getBookingSelection();
    }
  }, [salesByType, venueCode]);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const bookingIds = Object.keys(inputs)
      .sort((a, b) => inputs[a] - inputs[b])
      .filter((id) => inputs[id])
      .map((id) => parseInt(id, 10))
      .filter((id) => id);
    const productions: any[] = bookingIds.map((bookingId: any) =>
      bookings.find((booking) => booking.BookingId === bookingId),
    );
    onSubmit(bookingIds, productions);
    onClose();
  };
  const handleOnChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (!isNaN(selectedValue)) {
      const inputWithSelectedValue: string = Object.keys(inputs).find((code: string) => inputs[code] === selectedValue);
      const targetInputValue = inputs[e.target.id];
      setInputs((prev) => ({
        ...prev,
        [e.target.id]: selectedValue,
        [inputWithSelectedValue]: targetInputValue,
      }));
      return;
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: null,
    }));
  };
  return (
    <>
      <div>
        <StyledDialog
          className="max-w-full relative max-h-full"
          open={true}
          onClose={() => onClose()}
          title="Select Archived Productions for Display"
          width="xl"
        >
          {loading && (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          )}
          <form onSubmit={handleOnSubmit}>
            <div className="h-[50vh] overflow-auto">
              {bookings.map((booking, i) => (
                <div className="flex items-center mt-6" key={i}>
                  <label htmlFor="date" className="text-lg font-medium mr-4">
                    {booking.FullProductionCode}(WEEKS: {booking.ProductionLengthWeeks})
                  </label>
                  <select
                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              ))}
            </div>
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
        </StyledDialog>
      </div>
    </>
  );
};

export default BookingSelection;
