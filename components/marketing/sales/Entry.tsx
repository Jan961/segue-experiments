import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { newDate, toISO } from 'services/dateService';
import { formatDecimalOnBlur, isNullOrEmpty, isNullOrUndefined, isUndefined } from 'utils';
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
  changeWeek: (salesWeek: string) => void;
}

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

const Entry = forwardRef<SalesEntryRef>((_, ref) => {
  const [prevSalesFigureSet, setPrevSalesFigureSet] = useState<SalesFigureSet>(emptySalesSet);
  const [currSalesFigureSet, setCurrSalesFigureSet] = useState<SalesFigureSet>(emptySalesSet);
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
  const [bookings, setBookings] = useRecoilState(bookingJumpState);
  const [setId, setSetId] = useState(-1);
  const productionJump = useRecoilValue(productionJumpState);
  const [schoolErrors, setSchoolErrors] = useState([]);
  const [generalErrors, setGeneralErrors] = useState([]);
  const [warningIssued, setWarningIssued] = useState<boolean>(false);
  const currency = useRecoilValue(currencyState);
  const [finalSales, setFinalSales] = useState(false);

  const prodVenue = useMemo(() => {
    const production = productionJump.productions.find((prod) => prod.Id === productionJump.selected);
    const selectedBooking = bookings.bookings.find((booking) => booking.Id === bookings.selected);

    return selectedBooking?.Venue && production
      ? `for ${production?.ShowCode}${production?.Code} ${production?.ShowName} ${selectedBooking?.Venue?.Name}`
      : '';
  }, [bookings.selected]);

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
        seatsReserved: parseInt(salesFigures?.general?.seatsReserved) || null,
        seatsReservedVal: parseFloat(salesFigures?.general?.seatsReservedVal) || null,
        seatsSold: parseInt(salesFigures?.general?.seatsSold) || null,
        seatsSoldVal: parseFloat(salesFigures?.general?.seatsSoldVal) || null,
      },
      schools: {
        seatsReserved: parseInt(salesFigures?.schools?.seatsReserved) || null,
        seatsReservedVal: parseFloat(salesFigures?.schools?.seatsReservedVal) || null,
        seatsSold: parseInt(salesFigures?.schools?.seatsSold) || null,
        seatsSoldVal: parseFloat(salesFigures?.schools?.seatsSoldVal) || null,
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

      const { data: salesUpd } = await axios.post('/api/marketing/sales/entry/v2/upsert', data);

      if (typeof salesUpd === 'object') {
        const setIdObj = salesUpd as { setId: number };
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

  const setSalesFigures = async (inputDate: UTCDate, bookingId: number) => {
    try {
      if (isNullOrUndefined(bookingId)) return;

      let salesSetId = -1;
      let compHoldSetId = -1;

      const { data: sales } = await axios.post('/api/marketing/sales/current/read', {
        bookingId,
        salesDate: inputDate,
        prevRequired: true,
        productionId: productionJump.selected,
      });

      // if data returned from API is not null set the state variable so the form can be updated
      isNullOrUndefined(sales.current) ? setCurrSalesFigureSet(emptySalesSet) : setCurrSalesFigureSet(sales.current);
      isNullOrUndefined(sales.previous) ? setPrevSalesFigureSet(emptySalesSet) : setPrevSalesFigureSet(sales.previous);

      // set the setId from the current sales
      salesSetId = sales?.current?.setId;

      // remaining logic will be refactored as part of SK-566
      // (the entire Holds/Comps functionality is broken)

      const { data: holdCompList } = await axios.post('/api/marketing/sales/read/hold-comp', {
        bookingId: bookings.selected,
        salesDate,
        prodctionId: productionJump.selected,
      });

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

      // salesSetId will be taken by default, if it is undefined we will try for the compHoldSetId
      // (this will be populated if hold/comps are entered before sales)
      if (!isUndefined(salesSetId) || salesSetId > -1) {
        setSetId(salesSetId);
      } else {
        // otherwise - check to see if we have a compHoldSetId
        // it is important that we only have one set for each week or day depending on the frequency
        // if undefined, setId will be -1 and created in the API
        setSetId(isUndefined(compHoldSetId) ? -1 : compHoldSetId);
      }
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

        // check if final sales exist
        const { data: finalSales } = await axios.post('/api/marketing/sales/final/read', {
          bookingId: bookings.selected,
        });

        // if general.seatsSold is not an empty string - show final sales warning opposed to Sales Entry form
        // else get the sales figures from the database
        if (!isNullOrEmpty(finalSales?.general?.seatsSold)) {
          setFinalSales(true);
        } else {
          setFinalSales(false);
          setSalesFigures(inputDate, bookings.selected);
        }
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
    changeWeek: (week) => {
      const updatedDate = week ? newDate(week) : null;
      setSalesDate(updatedDate);
      if (updatedDate) {
        setSalesFigures(updatedDate, bookings.selected);
      }
    },
  }));

  return (
    <div>
      {bookings.selected !== undefined && bookings.selected !== null && (
        <div>
          {finalSales ? (
            <div className="text-base">
              Sales cannot be entered {prodVenue} because Final Sales have already been entered.
              <br />
              To enter further sales information, please return to Final Figures Entry and remove the previously entered
              figures.
            </div>
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
                        value={currSalesFigureSet?.general?.seatsSold}
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
                        value={currSalesFigureSet?.general?.seatsSoldVal}
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
                        value={currSalesFigureSet?.general?.seatsReserved}
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
                        value={currSalesFigureSet?.general?.seatsReservedVal}
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
                              value={currSalesFigureSet?.schools?.seatsSold}
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
                              value={currSalesFigureSet?.schools?.seatsSoldVal}
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
                              value={currSalesFigureSet?.schools?.seatsReserved}
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
                              value={currSalesFigureSet?.schools?.seatsReservedVal}
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
