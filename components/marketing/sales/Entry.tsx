import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { getDateDaysAway, getMonday, newDate, toISO } from 'services/dateService';
import { formatDecimalOnBlur, formatDecimalValue, isNullOrEmpty, isNullOrUndefined } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/global/currencyState';
import { UpdateWarningModal } from '../modal/UpdateWarning';
import axios from 'axios';
import { decRegexLeadingZero } from 'utils/regexUtils';
import { UTCDate } from '@date-fns/utc';

export type TourResponse = {
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
  setId: number;
}

export interface SalesEntryRef {
  resetForm: (salesWeek: string) => void;
}

const Entry = forwardRef<SalesEntryRef>((_, ref) => {
  const [prevSalesFigureSet, setPrevSalesFigureSet] = useState<SalesFigureSet>(null);
  const [currSalesFigureSet, setCurrSalesFigureSet] = useState<SalesFigureSet>(null);
  const [bookingHasSchoolSales, setBookingHasSchoolSales] = useState<boolean>(false);
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
  const [schoolErrors, setSchoolErrors] = useState([]);
  const [generalErrors, setGeneralErrors] = useState([]);
  const [warningIssued, setWarningIssued] = useState<boolean>(false);
  const currency = useRecoilValue(currencyState);
  const [salesApiAction, setSalesApiAction] = useState('create');

  const compareSalesFigures = (prev, curr) => {
    // If prev is null, there are no errors.
    if (!prev) {
      return null;
    }

    const fields = [
      { key: 'seatsReserved', name: 'Seats Reserved' },
      { key: 'seatsReservedVal', name: 'Seats Reserved Value' },
      { key: 'seatsSold', name: 'Seats Sold' },
      { key: 'seatsSoldVal', name: 'Seats Sold Value' },
    ];

    const errors = [];

    fields.forEach((field) => {
      if (curr[field.key] < prev[field.key]) {
        errors.push(`${field.name} in current weeks values is less than previously entered values.`);
      }
    });

    return errors.length > 0 ? errors : null;
  };

  const convertSalesFigures = (salesFigures) => {
    const result = {
      setId: salesFigures.setId,
      general: {
        seatsReserved: parseInt(salesFigures.general.seatsReserved),
        seatsReservedVal: parseFloat(salesFigures.general.seatsReservedVal),
        seatsSold: parseInt(salesFigures.general.seatsSold),
        seatsSoldVal: parseFloat(salesFigures.general.seatsSoldVal),
      },
      schools: {
        seatsReserved: parseInt(salesFigures.schools.seatsReserved),
        seatsReservedVal: parseFloat(salesFigures.schools.seatsReservedVal),
        seatsSold: parseInt(salesFigures.schools.seatsSold),
        seatsSoldVal: parseFloat(salesFigures.schools.seatsSoldVal),
      },
    };
    return result;
  };

  const handleUpdate = async () => {
    const prevFigs = convertSalesFigures(prevSalesFigureSet);
    const currFigs = convertSalesFigures(currSalesFigureSet);

    try {
      if (!warningIssued) {
        const generalErrors = compareSalesFigures(prevFigs.general, currFigs.general);
        const schoolErrors = compareSalesFigures(prevFigs.schools, currFigs.schools);

        let figuresHaveIssue = false;

        if (generalErrors !== null) {
          setGeneralErrors(generalErrors);
          figuresHaveIssue = true;
        }

        if (schoolErrors !== null) {
          setSchoolErrors(schoolErrors);
          figuresHaveIssue = true;
        }

        if (figuresHaveIssue) {
          setWarningIssued(true);
          return;
        }
      }

      let data = {
        bookingId: bookings.selected,
        salesDate,
        setId,
        general: currFigs.general,
        schools: currFigs.schools,
        action: salesApiAction,
      };

      const emptySchools = {
        seatsReserved: 0,
        seatsReservedVal: 0,
        seatsSold: 0,
        seatsSoldVal: 0,
      };

      if (JSON.stringify(currFigs.schools) !== JSON.stringify(emptySchools)) {
        data = { ...data, schools: currFigs.schools };
      }

      const response = await axios.post('/api/marketing/sales/entry/v2/upsert', data);

      if (typeof response.data === 'object') {
        const setIdObj = response.data as { setId: number; transaction: string };
        setSetId(setIdObj.setId);
        setWarningIssued(false);
        setSchoolErrors([]);
        setGeneralErrors([]);

        // reset page
        setBookings({ ...bookings, selected: null });
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

      const futureaCheckData = {
        bookingId: bookings.selected,
        type: fieldType,
        saleDate: toISO(salesDate).substring(0, 10),
        typeId: data.id,
        field,
      };

      const checkFutureResponse = await axios.post('/api/marketing/sales/check-future/read', futureaCheckData);
      const futureData = checkFutureResponse.data;

      const inputData = {
        value,
        data,
        type,
        field,
        setId,
        salesDate,
        bookingId: bookings.selected,
      };

      const response = await axios.post('/api/marketing/sales/entry/comp-hold/upsert', inputData);

      if (typeof response.data === 'object') {
        const setIdObj = response.data as { setId: number };
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
      await axios.post('/api/marketing/sales/entry/batch-update/update', batchUpdateData);
      setShowWarning(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    copyPreviousWeeks();
  };

  const getSalesFrequency = async () => {
    try {
      const response = await axios.get(`/api/marketing/sales/tourWeeks/${productionId.toString()}`);

      if (typeof response.data === 'object') {
        const tourData = response.data as TourResponse;
        if (tourData.frequency === undefined) {
          return;
        }

        return tourData.frequency;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // helper function for setSalesFigures to reduce duplicate code
  const createSalesFigure = (fig: SalesFigure | undefined) => ({
    seatsReserved: fig?.seatsReserved,
    seatsReservedVal: formatDecimalValue(fig?.seatsReservedVal),
    seatsSold: fig?.seatsSold,
    seatsSoldVal: formatDecimalValue(fig?.seatsSoldVal),
  });

  const setSalesFigures = async (inputDate: UTCDate, previous: boolean, bookingId: number) => {
    try {
      setLoading(true);

      const emptySalesSet = {
        setId: 0,
        general: {
          seatsReserved: '0',
          seatsReservedVal: '0.00',
          seatsSold: '0',
          seatsSoldVal: '0.00',
        },
        schools: {
          seatsReserved: '0',
          seatsReservedVal: '0.00',
          seatsSold: '0',
          seatsSoldVal: '0.00',
        },
      };

      // Set default sales figure set based on 'previous' flag
      if (previous) {
        setPrevSalesFigureSet(emptySalesSet);
      } else {
        setCurrSalesFigureSet(emptySalesSet);
        setSalesApiAction('create');
      }

      if (isNullOrUndefined(bookingId)) return;

      const frequency = await getSalesFrequency();
      const duration = frequency === 'W' ? 7 : 1;
      let salesDate = frequency === 'W' ? getMonday(inputDate) : inputDate;

      if (previous) salesDate = getDateDaysAway(salesDate, duration);

      const salesResponse = await axios.post('/api/marketing/sales/current/read', {
        bookingId,
        salesDate,
        frequency,
      });

      const sales = salesResponse.data;

      let salesSetId = -1;
      let compHoldSetId = -1;

      if (typeof sales === 'object' && !isNullOrEmpty(sales)) {
        const salesFigures = sales as SalesFigureSet;
        if (!previous) setSalesApiAction('update');

        const updatedSalesSet = {
          general: createSalesFigure(salesFigures.general),
          schools: createSalesFigure(salesFigures.schools),
          setId: salesFigures.setId,
        };

        if (previous) {
          setPrevSalesFigureSet(updatedSalesSet);
        } else {
          salesSetId = salesFigures.setId;
          setCurrSalesFigureSet(updatedSalesSet);
        }
      }

      if (!previous) {
        const holdCompResponse = await axios.post('/api/marketing/sales/read/hold-comp', {
          bookingId: bookings.selected,
          salesDate,
          productionId,
        });

        const holdCompList = holdCompResponse.data;
        if (typeof holdCompList === 'object') {
          const holdCompData = holdCompList as HoldCompSet;
          setHoldData(holdCompData.holds);
          setCompData(holdCompData.comps);
          compHoldSetId = holdCompData.setId;
        }

        const booking = bookings.bookings.find((b) => b.Id === bookingId);
        if (booking) {
          setBookingSaleNotes(booking.BookingSalesNotes || '');
          setCompNotes(booking.BookingCompNotes || '');
          setHoldNotes(booking.BookingHoldNotes || '');
          setBookingHasSchoolSales(booking.BookingHasSchoolsSales);
        }

        setSetId(salesSetId > -1 ? salesSetId : compHoldSetId > -1 ? compHoldSetId : -1);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
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
        case 'hasSchoolsSales':
          setBookingHasSchoolSales(value);
      }

      const fieldMapping = {
        salesNotes: 'BookingSalesNotes',
        holdNotes: 'BookingHoldNotes',
        compNotes: 'BookingCompNotes',
        hasSchoolsSales: 'BookingHasSchoolsSales',
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
      setBookings({ ...bookings, bookings: newBookings });

      // update in the database
      await axios.post(`/api/bookings/update/${bookings.selected.toString()}`, updObj);
    } catch (error) {
      console.log(error);
    }
  };

  const copyPreviousWeeks = () => {
    setCurrSalesFigureSet(prevSalesFigureSet);
  };

  const handleSalesFigChange = (key: string, type: string, value: string) => {
    setCurrSalesFigureSet({
      ...currSalesFigureSet,
      [type]: {
        ...currSalesFigureSet[type],
        [key]: value,
      },
    });
  };

  useEffect(() => {
    const initForm = async () => {
      try {
        let inputDate = newDate();
        if (salesDate !== null) {
          inputDate = salesDate;
        } else {
          setSalesDate(newDate());
        }

        setSalesFigures(inputDate, false, bookings.selected);
        setSalesFigures(inputDate, true, bookings.selected);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isNullOrUndefined(bookings.selected)) {
      initForm();
    }
  }, [bookings.selected]);

  // functionality to send data to the db when the return key is pressed - using an event listener so the other set functions are interfered with.
  // Temp commented out because state for current field is not processed therefore new value is not sent to DB
  // useEffect(() => {
  //   const handleKeyPress = async (event) => {
  //     if (event.key === 'Enter') {
  //       await handleUpdate();
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyPress);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, []);

  useImperativeHandle(ref, () => ({
    resetForm: (week) => {
      setSalesDate(newDate(week));
      setSalesFigures(newDate(week), false, null);
      setSalesFigures(newDate(week), true, null);
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
                <div className="w-[849px] bg-primary-green/[0.30] rounded-xl mt-5 p-4">
                  <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">General</div>

                  {generalErrors && generalErrors.length > 0 && (
                    <div className="flex flex-row">
                      <div className="leading-6 text-base text-primary-red font-bold mt-5">
                        {generalErrors.map((error, index) => (
                          <div className="flex flex-row" key={index}>
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-3">
                    {/* Row1 */}
                    <div className="flex justify-between items-center col-span-4">
                      <span className="text-primary-dark-blue base font-bold">Seats Sold</span>
                      <TextInput
                        className="w-[137px]"
                        placeholder="Enter Seats"
                        id="genSeatsSold"
                        value={currSalesFigureSet.general.seatsSold}
                        pattern={decRegexLeadingZero}
                        onFocus={(event) => event?.target?.select?.()}
                        onChange={(event) => handleSalesFigChange('seatsSold', 'general', event.target.value)}
                      />
                    </div>
                    <div className="flex justify-around items-center col-span-5">
                      <span className="w-[141px] text-end text-primary-dark-blue base font-bold">Seats Sold Value</span>
                      <TextInput
                        className="w-[137px]"
                        placeholder="Enter Value"
                        id="genSeatsSoldVal"
                        value={currSalesFigureSet.general.seatsSoldVal}
                        onFocus={(event) => event?.target?.select?.()}
                        pattern={/^\d*(\.\d*)?$/}
                        onChange={(event) => handleSalesFigChange('seatsSoldVal', 'general', event.target.value)}
                        onBlur={(event) => handleSalesFigChange('seatsSoldVal', 'general', formatDecimalOnBlur(event))}
                      />
                    </div>
                    <div className="flex items-center justify-end col-span-3">
                      <Button
                        className="w-[132px] flex flex-row"
                        variant="primary"
                        text="Update"
                        onClick={handleUpdate}
                      />
                    </div>
                    {/* Row2 */}
                    <div className="flex justify-between items-center col-span-4">
                      <span className="text-primary-dark-blue base font-bold">Reserved Seats</span>
                      <TextInput
                        className="w-[137px] h-[31px] flex flex-col -mt-1"
                        placeholder="Enter Seats"
                        id="genSeatsReserved"
                        value={currSalesFigureSet.general.seatsReserved}
                        onFocus={(event) => event?.target?.select?.()}
                        pattern={decRegexLeadingZero}
                        onChange={(event) => handleSalesFigChange('seatsReserved', 'general', event.target.value)}
                      />
                    </div>
                    <div className="flex justify-around items-center col-span-5">
                      <span className="w-[141px] text-primary-dark-blue base font-bold">Reserved Seats Value</span>
                      <TextInput
                        className="w-[137px]"
                        placeholder="Enter Value"
                        id="genSeatsReservedVal"
                        value={currSalesFigureSet.general.seatsReservedVal}
                        onFocus={(event) => event?.target?.select?.()}
                        pattern={/^\d*(\.\d*)?$/}
                        onChange={(event) => handleSalesFigChange('seatsReservedVal', 'general', event.target.value)}
                        onBlur={(event) =>
                          handleSalesFigChange('seatsReservedVal', 'general', formatDecimalOnBlur(event))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-end col-span-3">
                      <Button
                        className="w-[211px] flex flex-row"
                        variant="primary"
                        text="Copy Previous Week's Sales"
                        onClick={copyPreviousWeeks}
                      />
                    </div>
                    {!bookingHasSchoolSales && (
                      <div className="flex items-center justify col-span-3">
                        <span className="text-base text-primary-dark-blue font-bold mr-3 ">School Sales required</span>
                        <div className="flex flex-col">
                          <Checkbox
                            id="schSalesRequired"
                            name="schSalesRequired"
                            checked={false}
                            onChange={() => editBooking('hasSchoolsSales', true)}
                            className="w-[19px] h-[19px]"
                          />
                        </div>
                      </div>
                    )}
                    {!bookingHasSchoolSales && (
                      <div className="flex justify-end items-center justify col-span-9">
                        <Button className="w-[132px]" variant="secondary" text="Cancel" onClick={handleCancel} />
                      </div>
                    )}
                  </div>

                  {bookingHasSchoolSales && (
                    <div>
                      <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Schools</div>

                      {schoolErrors && schoolErrors.length > 0 && (
                        <div className="flex flex-row leading-6 text-base text-primary-red font-bold mt-5">
                          {schoolErrors.map((error, index) => (
                            <div className="flex flex-row" key={index}>
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Schools Grid */}
                      {
                        <div className="grid grid-cols-12 gap-1">
                          {/* Row1 */}
                          <div className="flex justify-between items-center col-span-4">
                            <span className="text-primary-dark-blue base font-bold">Seats Sold</span>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Seats"
                              id="schSeatsSold"
                              value={currSalesFigureSet.schools.seatsSold}
                              onFocus={(event) => event?.target?.select?.()}
                              pattern={decRegexLeadingZero}
                              onChange={(event) => handleSalesFigChange('seatsSold', 'schools', event.target.value)}
                            />
                          </div>
                          <div className="flex justify-around items-center col-span-5">
                            <span className="w-[141px] text-end text-primary-dark-blue base font-bold">
                              Seats Sold Value
                            </span>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="schSeatsSoldVal"
                              value={currSalesFigureSet.schools.seatsSoldVal}
                              onFocus={(event) => event?.target?.select?.()}
                              pattern={/^\d*(\.\d*)?$/}
                              onChange={(event) => handleSalesFigChange('seatsSoldVal', 'schools', event.target.value)}
                              onBlur={(event) =>
                                handleSalesFigChange('seatsSoldVal', 'schools', formatDecimalOnBlur(event))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-end col-span-3">
                            <div className="flex flex-row">
                              <span className="text-base text-primary-dark-blue font-bold mr-3">
                                School Sales not required
                              </span>
                              <Checkbox
                                id="schSalesNotRequired"
                                name="schSalesNotRequired"
                                checked={false}
                                onChange={() => editBooking('hasSchoolsSales', false)}
                                className="w-[19px] h-[19px]"
                              />
                            </div>
                          </div>
                          {/* Row2 */}
                          <div className="flex justify-between items-center col-span-4">
                            <span className="text-primary-dark-blue base font-bold">Reserved Seats</span>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Seats"
                              id="schSeatsReserved"
                              value={currSalesFigureSet.schools.seatsReserved}
                              onFocus={(event) => event?.target?.select?.()}
                              pattern={decRegexLeadingZero}
                              onChange={(event) => handleSalesFigChange('seatsReserved', 'schools', event.target.value)}
                            />
                          </div>
                          <div className="flex justify-around items-center col-span-5">
                            <span className="w-[141px] text-primary-dark-blue base font-bold">
                              Reserved Seats Value
                            </span>
                            <TextInput
                              className="w-[137px] h-[31px] flex flex-col -mt-1"
                              placeholder="Enter Value"
                              id="schSeatsReservedVal"
                              value={currSalesFigureSet.schools.seatsReservedVal}
                              onFocus={(event) => event?.target?.select?.()}
                              pattern={/^\d*(\.\d*)?$/}
                              onChange={(event) =>
                                handleSalesFigChange('seatsReservedVal', 'schools', event.target.value)
                              }
                              onBlur={(event) =>
                                handleSalesFigChange('seatsReservedVal', 'schools', formatDecimalOnBlur(event))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-end col-span-3">
                            <Button className="w-[132px]" variant="secondary" text="Cancel" onClick={handleCancel} />
                          </div>
                        </div>
                      }
                      {/* Grid Ends */}
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
                      tableHeight={700}
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
                      tableHeight={700}
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
