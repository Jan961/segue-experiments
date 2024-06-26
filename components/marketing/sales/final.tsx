import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Checkbox, TextArea, TextInput } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { addDurationToDate, getMonday } from 'services/dateService';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/marketing/currencyState';

type TourResponse = {
  data: Array<SelectOption>;
  frequency: string;
};

interface SalesFigure {
  seatsReserved: string;
  seatsReservedVal: string;
  seatsSold: string;
  seatsSoldVal: string;
}

interface SalesFigureSet {
  general: SalesFigure;
  schools: SalesFigure;
}

export interface SalesEntryRef {
  resetForm: (salesWeek: string) => void;
}

const Final = forwardRef<SalesEntryRef>((_, ref) => {
  const [genSeatsSold, setGenSeatsSold] = useState('');
  const [genSeatsSoldVal, setGenSeatsSoldVal] = useState('');
  const [genSeatsReserved, setGenSeatsReserved] = useState('');
  const [genSeatsReservedVal, setGenSeatsReservedVal] = useState('');
  const [schSeatsSold, setSchSeatsSold] = useState('');
  const [schSeatsSoldVal, setSchSeatsSoldVal] = useState('');
  const [schSeatsReserved, setSchSeatsReserved] = useState('');
  const [schSeatsReservedVal, setSchSeatsReservedVal] = useState('');
  const [hasSchoolsSales, setHasSchoolSales] = useState<boolean>(false);
  const [bookingSaleNotes, setBookingSaleNotes] = useState('');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');
  const [salesDate, setSalesDate] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useRecoilState(bookingJumpState);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const currency = useRecoilValue(currencyState);

  const { fetchData } = useAxios();

  const handleUpdate = async () => {
    try {
      const data = {
        bookingId: bookings.selected,
        salesDate,
        schools: {
          seatsSold: parseInt(schSeatsSold),
          seatsSoldVal: parseFloat(schSeatsSoldVal),
          seatsReserved: parseInt(schSeatsReserved),
          seatsReservedVal: parseFloat(schSeatsReservedVal),
        },
        general: {
          seatsSold: parseInt(genSeatsSold),
          seatsSoldVal: parseFloat(genSeatsSoldVal),
          seatsReserved: parseInt(genSeatsReserved),
          seatsReservedVal: parseFloat(genSeatsReservedVal),
        },
      };

      await fetchData({
        url: '/api/marketing/sales/process/entry/sales',
        method: 'POST',
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setSalesFigures(salesDate, false);
  };

  const setNumericVal = (setFunction: (value) => void, value: string) => {
    if (value === '') {
      setFunction(0);
    } else {
      const regexPattern = /^-?\d*(\.\d*)?$/;

      if (regexPattern.test(value)) {
        setFunction(value);
      }
    }
  };

  const getSalesFrequency = async () => {
    try {
      const data = await fetchData({
        url: '/api/marketing/sales/tourWeeks/' + productionId.toString(),
        method: 'POST',
      });

      if (typeof data === 'object') {
        const tourData = data as TourResponse;
        if (tourData.frequency === undefined) {
          return;
        }

        return tourData.frequency;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setSalesFigures = async (inputDate: Date, previous: boolean) => {
    try {
      setLoading(true);

      // handle when the useImperitive calls this function on selection of a sales week/day before the booking is selected
      // this will happen on first launch of the module
      if (bookings.selected === undefined || bookings.selected === null) {
        return;
      }

      const frequency = await getSalesFrequency();

      const duration = frequency === 'W' ? 7 : 1;
      let salesDate = frequency === 'W' ? getMonday(inputDate) : inputDate;

      if (previous) {
        salesDate = addDurationToDate(salesDate, duration, false);
      }

      // get the salesFigures for the selected date/week if they exist
      const sales = await fetchData({
        url: '/api/marketing/sales/read/currentDay',
        method: 'POST',
        data: {
          bookingId: bookings.selected,
          salesDate,
          frequency,
        },
      });

      if (typeof sales === 'object') {
        const salesFigures = sales as SalesFigureSet;

        // set the sales figures, if available
        setGenSeatsReserved(validateSale(salesFigures.general?.seatsReserved));
        setGenSeatsReservedVal(validateSale(salesFigures.general?.seatsReservedVal));
        setGenSeatsSold(validateSale(salesFigures.general?.seatsSold));
        setGenSeatsSoldVal(validateSale(salesFigures.general?.seatsSoldVal));
        setSchSeatsReserved(validateSale(salesFigures.schools?.seatsReserved));
        setSchSeatsReservedVal(validateSale(salesFigures.schools?.seatsReservedVal));
        setSchSeatsSold(validateSale(salesFigures.schools?.seatsSold));
        setSchSeatsSoldVal(validateSale(salesFigures.schools?.seatsSoldVal));
      }

      // get the booking details to set the notes fields
      const booking = bookings.bookings.find((booking) => booking.Id === bookings.selected);

      setBookingSaleNotes(booking.BookingSalesNotes === null ? '' : booking.BookingSalesNotes);
      setDiscrepancyNotes(booking.BookingFinalSalesDiscrepancyNotes);
      setHasSchoolSales(booking.BookingHasSchoolsSales);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const validateSale = (saleFigure) => {
    if (isNullOrEmpty(saleFigure)) {
      return '';
    } else {
      return saleFigure;
    }
  };

  const editBooking = async (field: string, value: any) => {
    try {
      const updObj = { [field]: value };

      // update locally first
      switch (field) {
        case 'salesNotes':
          setBookingSaleNotes(value);
          break;
        case 'finalSalesDiscrepancyNotes':
          setDiscrepancyNotes(value);
          break;
      }

      const fieldMapping = {
        salesNotes: 'BookingSalesNotes',
        finalSalesDiscrepancyNotes: 'BookingFinalSalesDiscrepancyNotes',
      };

      // Find the booking index
      const bookingIndex = bookings.bookings.findIndex((booking) => booking.Id === bookings.selected);

      // Create a new bookings array with the updated booking
      const newBookings = bookings.bookings.map((booking, index) => {
        if (index === bookingIndex) {
          return {
            ...booking,
            [fieldMapping[field]]: value,
          };
        }
        return booking;
      });

      // Update the bookings state with the new bookings array
      setBookings({ bookings: newBookings, selected: bookings.selected });

      // update in the database
      await fetchData({
        url: '/api/bookings/update/' + bookings.selected.toString(),
        method: 'POST',
        data: updObj,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initForm = async () => {
      try {
        setSalesDate(new Date());
        // set the current days sales figues if available
        setSalesFigures(new Date(), false);
      } catch (error) {
        console.log(error);
      }
    };

    if (bookings.selected !== undefined && bookings.selected !== null) {
      initForm();
    }
  }, [fetchData, bookings.selected]);

  useImperativeHandle(ref, () => ({
    resetForm: (week) => {
      setSalesDate(new Date(week));
      setSalesFigures(new Date(week), false);
    },
  }));

  return (
    <div>
      {bookings.selected !== undefined && bookings.selected !== null && (
        <div>
          {loading ? (
            <Spinner size="lg" className="mt-2 mr-3 -mb-1" />
          ) : (
            <div className="flex flex-row w-full gap-8">
              <div className="flex flex-col">
                <div
                  className={`w-[849px] ${
                    hasSchoolsSales ? 'h-[275px]' : 'h-[185px]'
                  } bg-primary-green/[0.30] rounded-xl mt-5 p-4`}
                >
                  <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">General</div>

                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col mr-[20px]">
                      <div className="flex flex-row mt-4">
                        <div className="flex flex-col">
                          <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                        </div>
                        <TextInput
                          className="w-[137px] h-[31px] flex flex-col -mt-1"
                          placeholder="Enter Seats"
                          id="genSeatsSold"
                          value={genSeatsSold}
                          onChange={(event) => setNumericVal(setGenSeatsSold, event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-row mt-4 items-center">
                        <div className="flex flex-row items-center mr-[20px]">
                          <div className="text-primary-dark-blue base font-bold">Value</div>
                          <div className="ml-10 -mr-3">{currency.symbol}</div>
                        </div>
                        <TextInput
                          className="w-[137px] h-[31px] flex flex-col -mt-1"
                          placeholder="Enter Value"
                          id="genSeatsSoldVal"
                          value={genSeatsSoldVal}
                          onChange={(event) => setNumericVal(setGenSeatsSoldVal, event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col mt-4 justify-end">
                      <div className="flex flex-col items-end">
                        <Button
                          className="w-[132px] flex flex-row mb-2"
                          variant="primary"
                          text="Update"
                          onClick={handleUpdate}
                        />
                        <Button
                          className="w-[132px] flex flex-row"
                          variant="secondary"
                          text="Cancel"
                          onClick={() => alert('cancel')}
                        />
                      </div>
                    </div>
                  </div>

                  {hasSchoolsSales ? (
                    <div>
                      <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Schools</div>

                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col mr-[20px]">
                          <div className="flex flex-row mt-4">
                            <div className="flex flex-col">
                              <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Seats"
                              id="schSeatsSold"
                              value={schSeatsSold}
                              onChange={(event) => setNumericVal(setSchSeatsSold, event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex flex-row mt-4 items-center">
                            <div className="flex flex-row items-center mr-[20px]">
                              <div className="text-primary-dark-blue base font-bold">Value</div>
                              <div className="ml-10 -mr-3">{currency.symbol}</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="schSeatsSoldVal"
                              value={schSeatsSoldVal}
                              onChange={(event) => setNumericVal(setSchSeatsSoldVal, event.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="gap-[510px] flex flex-row">
                      <div className="flex flex-row mb-5 mt-5">
                        <div className="text-base text-primary-dark-blue font-bold flex flex-col mr-3 ">
                          School Sales required
                        </div>
                        <div className="flex flex-col">
                          <Checkbox
                            id="schSalesRequired"
                            name="schSalesRequired"
                            checked={false}
                            onChange={null}
                            className="w-[19px] h-[19px]"
                          />
                        </div>
                      </div>

                      <Button className="w-[132px] mt-3" variant="secondary" text="Cancel" onClick={handleCancel} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">
                  Booking Sales Notes
                </div>
                <TextArea
                  className="mt-2 h-[124px] w-[543px] mb-10"
                  value={bookingSaleNotes}
                  placeholder="Notes Field"
                  onChange={(e) => setBookingSaleNotes(e.target.value)}
                  onBlur={(e) => editBooking('salesNotes', e.target.value)}
                />

                <div className="leading-6 text-xl text-primary-red font-bold -mt-5 flex-row">
                  Sales Discrepancy Notes
                </div>
                <TextArea
                  className="mt-2 h-[124px] w-[543px] mb-10"
                  value={discrepancyNotes}
                  placeholder="Notes Field"
                  onChange={(e) => setDiscrepancyNotes(e.target.value)}
                  onBlur={(e) => editBooking('finalSalesDiscrepancyNotes', e.target.value)}
                />

                <Button
                  className="w-[132px] flex flex-row mb-2"
                  variant="primary"
                  text="Update"
                  onClick={() => alert('ok')}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Final.displayName = 'Final';
export default Final;
