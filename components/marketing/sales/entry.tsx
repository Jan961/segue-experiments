import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { addDurationToDate, getMonday, toISO } from 'services/dateService';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/marketing/currencyState';
import { UpdateWarningModal } from '../modal/UpdateWarning';

type TourResponse = {
  data: Array<SelectOption>;
  frequency: string;
};

interface HoldComp {
  name: number;
  seats: number;
  value?: number;
  id: number;
  recId: number;
}

interface HoldCompSet {
  comps: Array<HoldComp>;
  holds: Array<HoldComp>;
  setId: number;
}

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

const Entry = forwardRef<SalesEntryRef>((_, ref) => {
  const [genSeatsSold, setGenSeatsSold] = useState('');
  const [genSeatsSoldVal, setGenSeatsSoldVal] = useState('');
  const [genSeatsReserved, setGenSeatsReserved] = useState('');
  const [genSeatsReservedVal, setGenSeatsReservedVal] = useState('');
  const [schSeatsSold, setSchSeatsSold] = useState('');
  const [schSeatsSoldVal, setSchSeatsSoldVal] = useState('');
  const [schSeatsReserved, setSchSeatsReserved] = useState('');
  const [schSeatsReservedVal, setSchSeatsReservedVal] = useState('');
  const [schoolSalesNotRequired, setSchoolSalesNotRequired] = useState<boolean>(false);
  const [bookingSaleNotes, setBookingSaleNotes] = useState('');
  const [holdData, setHoldData] = useState([]);
  const [holdNotes, setHoldNotes] = useState('');
  const [compData, setCompData] = useState([]);
  const [compNotes, setCompNotes] = useState('');
  const [salesDate, setSalesDate] = useState(null);
  const [futureData, setFutureData] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const [batchUpdateData, setBatchUpdateData] = useState({});
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warnFieldType, setWarnFieldType] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useRecoilState(bookingJumpState);
  const [setId, setSetId] = useState(-1);
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

      const response = await fetchData({
        url: '/api/marketing/sales/process/entry/sales',
        method: 'POST',
        data,
      });

      if (typeof response === 'object') {
        const setIdObj = response as { setId: number };
        setSetId(setIdObj.setId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTableUpdate = async (value, data, type, field) => {
    try {
      setFieldName(data.name);

      // first check for future data - we may need to batch update other fields
      const fieldType = type === 'Holds' ? 'Hold' : 'Comp';
      setWarnFieldType(fieldType);
      const futureData: any = await fetchData({
        url: '/api/marketing/sales/read/checkFuture',
        method: 'POST',
        data: {
          bookingId: bookings.selected,
          type: fieldType,
          saleDate: toISO(salesDate).substring(0, 10),
          typeId: data.id,
          field,
        },
      });

      const inputData = {
        value,
        data,
        type,
        field,
        setId,
        salesDate,
        bookingId: bookings.selected,
      };

      const response = await fetchData({
        url: '/api/marketing/sales/process/entry/compHold',
        method: 'POST',
        data: inputData,
      });

      if (typeof response === 'object') {
        const setIdObj = response as { setId: number };
        setSetId(setIdObj.setId);
      }

      // there are future field, show warning
      if (futureData.length > 0) {
        setBatchUpdateData({
          value,
          bookingId: bookings.selected,
          typeId: data.id,
          type: fieldType,
          saleDate: salesDate,
          field,
        });

        if (fieldType === 'Hold') {
          const holdMapped = futureData.map((hold) => {
            return {
              seats: hold.SetHoldSeats,
              value: hold.SetHoldValue,
              date: hold.SetSalesFiguresDate,
            };
          });

          setFutureData(holdMapped);
          setShowWarning(true);
        } else {
          const compMapped = futureData.map((comp) => {
            return {
              seats: comp.SetCompSeats,
              date: comp.SetSalesFiguresDate,
            };
          });

          setFutureData(compMapped);
          setShowWarning(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const batchUpdate = async () => {
    try {
      await fetchData({
        url: '/api/marketing/sales/process/entry/batchUpdate',
        method: 'POST',
        data: batchUpdateData,
      });

      setShowWarning(false);
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

      // holds and comps
      const holdCompList = await fetchData({
        url: '/api/marketing/sales/read/holdComp',
        method: 'POST',
        data: {
          bookingId: bookings.selected,
          salesDate,
        },
      });

      if (typeof holdCompList === 'object') {
        const holdCompData = holdCompList as HoldCompSet;

        setHoldData(holdCompData.holds);
        setCompData(holdCompData.comps);
        setSetId(holdCompData.setId);
      }

      // get the booking details to set the notes fields
      const booking = bookings.bookings.find((booking) => booking.Id === bookings.selected);

      setBookingSaleNotes(booking.BookingSalesNotes === null ? '' : booking.BookingSalesNotes);
      setCompNotes(booking.BookingCompNotes === null ? '' : booking.BookingCompNotes);
      setHoldNotes(booking.BookingHoldNotes === null ? '' : booking.BookingHoldNotes);

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
        case 'holdNotes':
          setHoldNotes(value);
          break;
        case 'compNotes':
          setCompNotes(value);
          break;
      }

      const fieldMapping = {
        salesNotes: 'BookingSalesNotes',
        holdNotes: 'BookingHoldNotes',
        compNotes: 'BookingCompNotes',
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
                    schoolSalesNotRequired ? 'h-[185px]' : 'h-[275px]'
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

                      <div className="flex flex-row mt-4">
                        <div className="flex flex-col">
                          <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                        </div>
                        <TextInput
                          className="w-[137px] h-[31px] flex flex-col -mt-1"
                          placeholder="Enter Seats"
                          id="genSeatsReserved"
                          value={genSeatsReserved}
                          onChange={(event) => setNumericVal(setGenSeatsReserved, event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-row mt-4">
                        <div className="flex flex-col">
                          <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                        </div>
                        <TextInput
                          className="w-[137px] h-[31px] flex flex-col -mt-1"
                          placeholder="Enter Value"
                          id="genSeatsSoldVal"
                          value={genSeatsSoldVal}
                          onChange={(event) => setNumericVal(setGenSeatsSoldVal, event.target.value)}
                        />
                      </div>

                      <div className="flex flex-row mt-4">
                        <div className="flex flex-col">
                          <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                        </div>
                        <TextInput
                          className="w-[137px] h-[31px] flex flex-col -mt-1"
                          placeholder="Enter Value"
                          id="genSeatsReservedVal"
                          value={genSeatsReservedVal}
                          onChange={(event) => setNumericVal(setGenSeatsReservedVal, event.target.value)}
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
                          className="w-[211px] flex flex-row"
                          variant="primary"
                          text="Copy Previous Week's Sales"
                          onClick={() => setSalesFigures(salesDate, true)}
                        />
                      </div>
                    </div>
                  </div>

                  {schoolSalesNotRequired ? (
                    <div className="gap-[510px] flex flex-row">
                      <div className="flex flex-row mb-5 mt-5">
                        <div className="text-base text-primary-dark-blue font-bold flex flex-col mr-3 ">
                          School Sales required
                        </div>
                        <div className="flex flex-col">
                          <Checkbox
                            id="schSalesNotRequired"
                            name="schSalesNotRequired"
                            checked={false}
                            onChange={() => setSchoolSalesNotRequired(false)}
                            className="w-[19px] h-[19px]"
                          />
                        </div>
                      </div>

                      <Button className="w-[132px] mt-3" variant="secondary" text="Cancel" onClick={handleCancel} />
                    </div>
                  ) : (
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

                          <div className="flex flex-row mt-4">
                            <div className="flex flex-col">
                              <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Seats"
                              id="schSeatsReserved"
                              value={schSeatsReserved}
                              onChange={(event) => setNumericVal(setSchSeatsReserved, event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex flex-row mt-4">
                            <div className="flex flex-col">
                              <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="schSeatsSoldVal"
                              value={schSeatsSoldVal}
                              onChange={(event) => setNumericVal(setSchSeatsSoldVal, event.target.value)}
                            />
                          </div>

                          <div className="flex flex-row mt-4">
                            <div className="flex flex-col">
                              <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                            </div>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="schSeatsReservedVal"
                              value={schSeatsReservedVal}
                              onChange={(event) => setNumericVal(setSchSeatsReservedVal, event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col mt-4 justify-end">
                          <div className="flex flex-col items-end">
                            <div className="flex flex-row mb-5">
                              <div className="text-base text-primary-dark-blue font-bold flex flex-col mr-3">
                                School Sales not required
                              </div>
                              <div className="flex flex-col">
                                <Checkbox
                                  id="schSalesNotRequired"
                                  name="schSalesNotRequired"
                                  checked={false}
                                  onChange={() => setSchoolSalesNotRequired(true)}
                                  className="w-[19px] h-[19px]"
                                />
                              </div>
                            </div>

                            <Button
                              className="w-[132px] flex flex-row"
                              variant="secondary"
                              text="Cancel"
                              onClick={handleCancel}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row w-[849px] gap-6 mt-5">
                  <div className="flex flex-col w-[415px]">
                    <Table
                      columnDefs={salesEntryColDefs('Holds', currency.symbol, handleTableUpdate)}
                      rowData={holdData}
                      styleProps={styleProps}
                      gridOptions={{ suppressHorizontalScroll: true }}
                    />

                    <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Holds Notes</div>
                    <TextArea
                      className="mt-2 h-[105px] w-[416px] mb-10"
                      value={holdNotes}
                      placeholder="Notes Field"
                      onChange={(e) => setHoldNotes(e.target.value)}
                      onBlur={(e) => editBooking('holdNotes', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col w-[300px]">
                    <Table
                      columnDefs={salesEntryColDefs('Comps', currency.symbol, handleTableUpdate)}
                      rowData={compData}
                      styleProps={styleProps}
                      gridOptions={{ suppressHorizontalScroll: true }}
                    />

                    <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Comp Notes</div>
                    <TextArea
                      className="mt-2 h-[105px] w-[416px] mb-10"
                      value={compNotes}
                      placeholder="Notes Field"
                      onChange={(e) => setCompNotes(e.target.value)}
                      onBlur={(e) => editBooking('compNotes', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">
                  Booking Sales Notes
                </div>
                <TextArea
                  className="mt-2 h-[1030px] w-[514px] mb-10"
                  value={bookingSaleNotes}
                  placeholder="Notes Field"
                  onChange={(e) => setBookingSaleNotes(e.target.value)}
                  onBlur={(e) => editBooking('salesNotes', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <UpdateWarningModal
        data={futureData}
        onCancel={() => setShowWarning(false)}
        type={warnFieldType}
        visible={showWarning}
        name={fieldName}
        onSave={batchUpdate}
      />
    </div>
  );
});

Entry.displayName = 'Entry';
export default Entry;
