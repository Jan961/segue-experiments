import { useEffect, useState } from 'react';
import { Button, Checkbox, TextArea, TextInput } from 'components/core-ui-lib';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { formatDecimalOnBlur, isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/global/currencyState';
import { currentUserState } from 'state/marketing/currentUserState';
import { TourResponse } from './Entry';
import { productionJumpState } from 'state/booking/productionJumpState';
import axios from 'axios';
import { UTCDate } from '@date-fns/utc';
import { areDatesSame, getDateDaysAway, newDate } from 'services/dateService';
import { decRegexLeadingZero } from 'utils/regexUtils';

interface SalesFigure {
  seatsReserved: string;
  seatsReservedVal: string;
  seatsSold: string;
  seatsSoldVal: string;
}

interface SalesFigureSet {
  general: SalesFigure;
  schools: SalesFigure;
  user: string;
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
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [schoolWarning, setSchoolWarning] = useState('');
  const [generalWarning, setGeneralWarning] = useState('');
  const [showDiscrepancyNotes, setShowDiscrepancyNotes] = useState<boolean>(false);
  const [discrepancyButtonText, setDiscepancyButtonText] = useState('Ok');
  const [setId, setSetId] = useState(-1);

  const getSalesFrequency = async () => {
    try {
      const response = await axios.get('/api/marketing/sales/tourWeeks/' + productionId.toString());
      const data = response.data;

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

  const handleUpdate = async () => {
    try {
      const frequency = await getSalesFrequency();

      // get previous sales figures first and check for errors
      const { data: prevSales } = await axios.post('/api/marketing/sales/current/read', {
        bookingId: bookings.selected,
        salesDate: null,
        frequency,
      });

      // conly complete checks if discrepancy notes are not visible
      if (!showDiscrepancyNotes) {
        if (!isNullOrEmpty(prevSales)) {
          if (typeof prevSales === 'object') {
            const salesFigures = prevSales as SalesFigureSet;

            let tempGeneralWarning = '';
            // check if the final value submitted is lower the the last sales entry
            if (!salesFigures.general.seatsSold && !salesFigures.general.seatsSoldVal) {
              if (parseInt(genSeatsSold) < parseInt(salesFigures.general.seatsSold)) {
                tempGeneralWarning =
                  `Number of general seats sold (${genSeatsSold}) is less than ` +
                  `the previously entered value (${salesFigures.general.seatsSold})\n`;
              }

              if (parseInt(genSeatsSoldVal) < parseInt(salesFigures.general.seatsSoldVal)) {
                tempGeneralWarning =
                  tempGeneralWarning +
                  `Value of general seats (${genSeatsSoldVal}) is less than the ` +
                  `previously entered value (${salesFigures.general.seatsSoldVal})\n`;
              }
            }

            let tempSchoolWarning = '';
            if (salesFigures.schools.seatsSold && salesFigures.schools.seatsSoldVal) {
              if (parseInt(schSeatsSold) < parseInt(salesFigures.schools.seatsSold)) {
                tempSchoolWarning =
                  `Number of school seats sold (${genSeatsSold}) is less than ` +
                  `the previously entered value (${salesFigures.general.seatsSold})\n`;
              }

              if (parseInt(genSeatsSoldVal) < parseInt(salesFigures.schools.seatsSoldVal)) {
                tempSchoolWarning =
                  tempSchoolWarning +
                  `Value of school seats sold (${genSeatsSoldVal}) is less than ` +
                  `the previously entered value (${salesFigures.general.seatsSoldVal})\n`;
              }
            }

            // if tempWarning is not blank, setWarning, display the discrepency note field and exit the function
            if (tempGeneralWarning || tempSchoolWarning) {
              setSchoolWarning(tempSchoolWarning);
              setGeneralWarning(tempGeneralWarning);
              setShowDiscrepancyNotes(true);
              setConfirmedUser('');
              setUserConfirmed(false);

              return;
            }
          }
        }
      }

      // if final sales are being entered on the same day as normal sales - set final sales date to the next day
      let finalSalesDate = new UTCDate();
      if (areDatesSame(newDate(prevSales.setSaleFiguresDate), new UTCDate())) {
        finalSalesDate = getDateDaysAway(finalSalesDate, 1);
      }

      const data = {
        salesDate: finalSalesDate,
        bookingId: bookings.selected,
        user: currentUser,
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
        SetId: setId,
      };

      const finalEntryCreate = await axios.post(
        `/api/marketing/sales/final/${setId === -1 ? 'create' : 'update'}`,
        data,
      );
      setSetId(finalEntryCreate.data.setId);

      setBookings({ ...bookings, selected: null });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setSchSeatsSold('');
    setSchSeatsSoldVal('');
    setGenSeatsSold('');
    setGenSeatsSoldVal('');
    setDiscrepancyNotes('');
    setGeneralWarning('');
    setSchoolWarning('');
    setShowDiscrepancyNotes(false);
  };

  const setSalesFigures = async () => {
    try {
      setLoading(true);
      setUserConfirmed(false);
      setShowDiscrepancyNotes(false);
      setGeneralWarning('');
      setSchoolWarning('');
      setConfirmedUser('');
      setGenSeatsSold('');
      setGenSeatsSoldVal('');
      setSchSeatsSold('');
      setSchSeatsSoldVal('');

      // handle when the useImperitive calls this function on selection of a sales week/day before the booking is selected
      // this will happen on first launch of the module
      if (bookings.selected === undefined || bookings.selected === null) {
        return;
      }

      // get the salesFigures for the selected date/week if they exist
      const { data: sales } = await axios.post('/api/marketing/sales/final/read', {
        bookingId: bookings.selected,
      });

      if (Object.values(sales).length > 0) {
        const salesFigures = sales as SalesFigureSet;

        if (sales.setId) {
          setSetId(sales.setId);

          // set the sales figures, if available
          setGenSeatsSold(validateSale(salesFigures.general?.seatsSold));
          setGenSeatsSoldVal(validateSale(salesFigures.general?.seatsSoldVal));
          setSchSeatsSold(validateSale(salesFigures.schools?.seatsSold));
          setSchSeatsSoldVal(validateSale(salesFigures.schools?.seatsSoldVal));

          if (isNullOrEmpty(salesFigures.user)) {
            setUserConfirmed(false);
            setConfirmedUser('');
          } else {
            setUserConfirmed(true);
            setConfirmedUser(salesFigures.user);
          }
        }

        // get the booking details to set the notes fields
        const booking = bookings.bookings.find((booking) => booking.Id === bookings.selected);

        setBookingSaleNotes(booking.BookingSalesNotes === null ? '' : booking.BookingSalesNotes);
        setDiscrepancyNotes(booking.BookingFinalSalesDiscrepancyNotes);
        setHasSchoolSales(booking.BookingHasSchoolsSales);

        // if discrepancy notes is not null set show them
        if (!isNullOrEmpty(booking.BookingFinalSalesDiscrepancyNotes)) {
          setShowDiscrepancyNotes(true);
          setDiscepancyButtonText('Edit');
        }
      }

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

  const submitDiscrepancyNotes = () => {
    // if button is current edit, field is made editable
    if (discrepancyButtonText === 'Edit') {
      setDiscepancyButtonText('Ok');
      // else field is set and the button is changed back  to edit
    } else {
      setDiscepancyButtonText('Edit');
      editBooking('finalSalesDiscrepancyNotes', discrepancyNotes);
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
      await axios.post('/api/bookings/update/' + bookings.selected.toString(), updObj);
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
        setSetId(-1);
        setSalesFigures();
      } catch (error) {
        console.log(error);
      }
    };

    if (bookings.selected) {
      initForm();
    }
  }, [bookings.selected]);

  return (
    <div>
      {bookings.selected && (
        <div>
          {loading ? (
            <Spinner size="lg" className="mt-2 mr-3 -mb-1" />
          ) : (
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="w-[900px] h-auto bg-primary-green/[0.30] rounded-xl mt-5 p-4">
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <div className="flex flex-row">
                        <div className="leading-6 text-xl text-primary-input-text font-bold mt-1">General</div>
                      </div>

                      {generalWarning && (
                        <div className="flex flex-row">
                          <div className="leading-6 text-base text-primary-red font-bold mt-5">{generalWarning}</div>
                        </div>
                      )}

                      <div className="flex flex-row">
                        <div className="flex flex-col mr-[20px]">
                          <div className="flex flex-row mt-4">
                            <div className="flex flex-col">
                              <div className="text-primary-dark-blue base font-bold mr-[10px]">Seats Sold</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Seats"
                              id="genSeatsSold"
                              value={genSeatsSold === '0' ? '' : genSeatsSold}
                              onFocus={(event) => event?.target?.select?.()}
                              onChange={(event) => setGenSeatsSold(event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex flex-row mt-4 items-center">
                            <div className="flex flex-row items-center mr-[20px]">
                              <div className="text-primary-dark-blue base font-bold ml-[10px]">Value</div>
                              <div className="ml-5 -mr-3">{currency.symbol}</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="genSeatsSoldVal"
                              value={genSeatsSoldVal === '0' ? '' : genSeatsSoldVal}
                              pattern={decRegexLeadingZero}
                              onFocus={(event) => event?.target?.select?.()}
                              onBlur={(event) => setGenSeatsSoldVal(formatDecimalOnBlur(event))}
                              onChange={(event) => setGenSeatsSoldVal(event.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {hasSchoolsSales && (
                        <div className="mt-5">
                          <div className="flex flex-row">
                            <div className="leading-6 text-xl text-primary-input-text font-bold">School</div>
                          </div>

                          {schoolWarning && (
                            <div className="flex flex-row">
                              <div className="leading-6 text-xl text-primary-red font-bold mt-5">{schoolWarning}</div>
                            </div>
                          )}

                          <div className="flex flex-row">
                            <div className="flex flex-col mr-[20px]">
                              <div className="flex flex-row mt-4">
                                <div className="flex flex-col">
                                  <div className="text-primary-dark-blue base font-bold mr-[10px]">Seats Sold</div>
                                </div>
                                <TextInput
                                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                                  placeholder="Enter Seats"
                                  id="schSeatsSold"
                                  value={schSeatsSold === '0' ? '' : schSeatsSold}
                                  onFocus={(event) => event?.target?.select?.()}
                                  onChange={(event) => setSchSeatsSold(event.target.value)}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col">
                              <div className="flex flex-row mt-4 items-center">
                                <div className="flex flex-row items-center mr-[20px]">
                                  <div className="text-primary-dark-blue base font-bold ml-[10px]">Value</div>
                                  <div className="ml-5 -mr-3">{currency.symbol}</div>
                                </div>
                                <TextInput
                                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                                  placeholder="Enter Value"
                                  id="schSeatsSoldVal"
                                  value={schSeatsSoldVal === '0' ? '' : schSeatsSoldVal}
                                  pattern={decRegexLeadingZero}
                                  onFocus={(event) => event?.target?.select?.()}
                                  onBlur={(event) => setSchSeatsSoldVal(formatDecimalOnBlur(event))}
                                  onChange={(event) => setSchSeatsSoldVal(event.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col ml-[280px]">
                      <div className="flex flex-row mt-[42px]">
                        <Button
                          className="w-[132px] flex flex-row mb-2"
                          variant="primary"
                          text="Update"
                          onClick={handleUpdate}
                          disabled={!userConfirmed}
                        />
                      </div>

                      <div className="flex flex-row mb-3">
                        <Button
                          className="w-[132px] flex flex-row mb-2"
                          variant="secondary"
                          text="Cancel"
                          onClick={handleCancel}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row mt-5">
                    <div className="flex flex-col">
                      <div className="leading-6 text-base text-primary-input-text font-bold">
                        I confirm these are the final figures for the above production venue / date, as agreed by all
                        parties.
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Checkbox
                        id="userConfirmed"
                        name="userConfirmed"
                        checked={userConfirmed}
                        onChange={() => markUserConfirmed(!userConfirmed)}
                        className="w-[19px] h-[19px] ml-5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row mt-3">
                    <TextInput
                      className="w-[364px] h-[31px] flex flex-col"
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

                {showDiscrepancyNotes && (
                  <div>
                    <div className="leading-6 text-xl text-primary-red font-bold mt-5 flex-row">
                      Sales Discrepancy Notes
                    </div>
                    <TextArea
                      className="mt-2 h-[124px] w-[543px] mb-5"
                      value={discrepancyNotes}
                      placeholder="Notes Field"
                      onChange={(e) => setDiscrepancyNotes(e.target.value)}
                      disabled={discrepancyButtonText === 'Edit'}
                    />

                    <Button
                      className="w-[65px] flex flex-row float-right"
                      variant="primary"
                      text={discrepancyButtonText}
                      onClick={submitDiscrepancyNotes}
                    />
                  </div>
                )}
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
