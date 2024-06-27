import { useEffect, useState } from 'react';
import { Button, Checkbox, TextArea, TextInput } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/marketing/currencyState';
import { currentUserState } from 'state/marketing/currentUserState';

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

const Final = () => {
  const [genSeatsSold, setGenSeatsSold] = useState('');
  const [genSeatsSoldVal, setGenSeatsSoldVal] = useState('');
  const [schSeatsSold, setSchSeatsSold] = useState('');
  const [schSeatsSoldVal, setSchSeatsSoldVal] = useState('');
  const [hasSchoolsSales, setHasSchoolSales] = useState<boolean>(false);
  const [bookingSaleNotes, setBookingSaleNotes] = useState('');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useRecoilState(bookingJumpState);
  const currentUser = useRecoilValue(currentUserState);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [confirmedUser, setConfirmedUser] = useState('');
  const currency = useRecoilValue(currencyState);

  const { fetchData } = useAxios();

  const handleUpdate = async () => {
    try {
      const data = {
        salesDate: new Date(),
        bookingId: bookings.selected,
        user: currentUser.name,
        schools: hasSchoolsSales
          ? {
              seatsSold: parseInt(schSeatsSold),
              seatsSoldVal: parseFloat(schSeatsSoldVal),
            }
          : {},
        general: {
          seatsSold: parseInt(genSeatsSold),
          seatsSoldVal: parseFloat(genSeatsSoldVal),
        },
      };

      await fetchData({
        url: '/api/marketing/sales/process/entry/final',
        method: 'POST',
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setSchSeatsSold('');
    setSchSeatsSoldVal('');
    setGenSeatsSold('');
    setGenSeatsSoldVal('');
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

  const setSalesFigures = async () => {
    try {
      setLoading(true);

      // handle when the useImperitive calls this function on selection of a sales week/day before the booking is selected
      // this will happen on first launch of the module
      if (bookings.selected === undefined || bookings.selected === null) {
        return;
      }

      // get the salesFigures for the selected date/week if they exist
      const sales = await fetchData({
        url: '/api/marketing/sales/read/final',
        method: 'POST',
        data: {
          bookingId: bookings.selected,
        },
      });

      if (typeof sales === 'object') {
        const salesFigures = sales as SalesFigureSet;

        // set the sales figures, if available
        setGenSeatsSold(validateSale(salesFigures.general?.seatsSold));
        setGenSeatsSoldVal(validateSale(salesFigures.general?.seatsSoldVal));
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

  const markUserConfirmed = (status: boolean) => {
    setUserConfirmed(status);
    setConfirmedUser(status ? currentUser.toString() : '');
  };

  useEffect(() => {
    const initForm = async () => {
      try {
        // set the current days sales figues if available
        setSalesFigures();
      } catch (error) {
        console.log(error);
      }
    };

    if (bookings.selected !== undefined && bookings.selected !== null) {
      initForm();
    }
  }, [fetchData, bookings.selected]);

  return (
    <div>
      {bookings.selected !== undefined && bookings.selected !== null && (
        <div>
          {loading ? (
            <Spinner size="lg" className="mt-2 mr-3 -mb-1" />
          ) : (
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div
                  className={`w-[849px] ${
                    hasSchoolsSales ? 'h-[295px]' : 'h-[235px]'
                  } bg-primary-green/[0.30] rounded-xl mt-5 p-4`}
                >
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <div className="flex flex-row">
                        <div className="leading-6 text-xl text-primary-input-text font-bold mt-1">General</div>
                      </div>

                      <div className="flex flex-row">
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
                      </div>

                      {hasSchoolsSales && (
                        <div>
                          <div className="flex flex-row">
                            <div className="leading-6 text-xl text-primary-input-text font-bold mt-5">School</div>
                          </div>

                          <div className="flex flex-row">
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
                      )}
                    </div>

                    <div className="flex flex-col ml-[150px]">
                      <div className="flex flex-row mt-[42px]">
                        <Button
                          className="w-[132px] flex flex-row mb-2"
                          variant="primary"
                          text="Update"
                          onClick={handleUpdate}
                          disabled={!userConfirmed}
                        />
                      </div>

                      <div className="flex flex-row">
                        <Button
                          className="w-[132px] flex flex-row mb-2"
                          variant="secondary"
                          text="Cancel"
                          onClick={handleCancel}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <div className="leading-6 text-base text-primary-input-text font-bold mt-5">
                        I confirm these are the final figures for the above production venue / date, as agreed by all
                        parties.
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Checkbox
                        id="schSalesNotRequired"
                        name="schSalesNotRequired"
                        checked={userConfirmed}
                        onChange={() => markUserConfirmed(!userConfirmed)}
                        className="w-[19px] h-[19px] mt-6 ml-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row">
                    <TextInput
                      className="w-[364px] h-[31px] flex flex-col mt-3"
                      id="currentUser"
                      value={confirmedUser}
                      disabled={true}
                      onChange={null}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col ml-5">
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Final.displayName = 'Final';
export default Final;
