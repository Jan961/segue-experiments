import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { addDurationToDate, getMonday, toISO } from 'services/dateService';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/global/currencyState';
import { UpdateWarningModal } from '../modal/UpdateWarning';
import axios from 'axios';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

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
  seatsReserved: number;
  seatsReservedVal: number;
  seatsSold: number;
  seatsSoldVal: number;
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
  const permissions = useRecoilValue(accessMarketingHome);

  const compareSalesFigures = (prev: SalesFigure, curr: SalesFigure) => {
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

  const handleUpdate = async () => {
    try {
      if (!warningIssued) {
        const generalErrors = compareSalesFigures(prevSalesFigureSet.general, currSalesFigureSet.general);
        const schoolErrors = compareSalesFigures(prevSalesFigureSet.schools, currSalesFigureSet.schools);

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
        general: currSalesFigureSet.general,
        schools: {},
        action: salesApiAction,
      };

      const emptySchools = {
        seatsReserved: 0,
        seatsReservedVal: 0,
        seatsSold: 0,
        seatsSoldVal: 0,
      };

      if (JSON.stringify(currSalesFigureSet.schools) !== JSON.stringify(emptySchools)) {
        data = { ...data, schools: currSalesFigureSet.schools };
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

  const sanitiseSalesFigue = (value: string): number => {
    if (value === '') {
      return 0;
    } else {
      const regexPattern = /^-?\d*(\.\d*)?$/;

      if (regexPattern.test(value)) {
        return parseInt(value);
      }
    }
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

  const setSalesFigures = async (inputDate: Date, previous: boolean) => {
    try {
      setLoading(true);

      let salesSetId = -1;
      let compHoldSetId = -1;

      const emptySalesSet = {
        setId: 0,
        general: {
          seatsReserved: 0,
          seatsReservedVal: 0,
          seatsSold: 0,
          seatsSoldVal: 0,
        },
        schools: {
          seatsReserved: 0,
          seatsReservedVal: 0,
          seatsSold: 0,
          seatsSoldVal: 0,
        },
      };

      if (previous) {
        setPrevSalesFigureSet(emptySalesSet);
      } else {
        setCurrSalesFigureSet(emptySalesSet);

        // resetting api action every time a new week is selected
        setSalesApiAction('create');
      }

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

      const salesReadInput = {
        bookingId: bookings.selected,
        salesDate,
        frequency,
      };

      // get the salesFigures for the selected date/week if they exist
      const salesResponse = await axios.post('/api/marketing/sales/current/read', salesReadInput);
      const sales = salesResponse.data;

      if (typeof sales === 'object' && !isNullOrEmpty(sales)) {
        const salesFigures = sales as SalesFigureSet;

        // if the code gets into this block - there will be sales figures and therefore when running the api, it should update opposed to create
        // previous check as we only want to do this for the selected week
        if (!previous) {
          setSalesApiAction('update');
        }

        // set the sales figures, if available
        const general: SalesFigure = {
          seatsReserved: validateSale(salesFigures.general?.seatsReserved),
          seatsReservedVal: validateSale(salesFigures.general?.seatsReservedVal),
          seatsSold: validateSale(salesFigures.general?.seatsSold),
          seatsSoldVal: validateSale(salesFigures.general?.seatsSoldVal),
        };

        const schools: SalesFigure = {
          seatsReserved: validateSale(salesFigures.schools?.seatsReserved),
          seatsReservedVal: validateSale(salesFigures.schools?.seatsReservedVal),
          seatsSold: validateSale(salesFigures.schools?.seatsSold),
          seatsSoldVal: validateSale(salesFigures.schools?.seatsSoldVal),
        };

        if (previous) {
          setPrevSalesFigureSet({ general, schools, setId: salesFigures.setId });
        } else {
          // only ever set the setId for the current week
          salesSetId = salesFigures.setId;
          setCurrSalesFigureSet({ general, schools, setId: salesFigures.setId });
        }
      }

      if (!previous) {
        // holds and comps - only run if not retrieving previous values - previous is only valid for the main sales
        const response = await axios.post('/api/marketing/sales/read/hold-comp', {
          bookingId: bookings.selected,
          salesDate,
          productionId,
        });

        const holdCompList = response.data;

        if (typeof holdCompList === 'object') {
          const holdCompData = holdCompList as HoldCompSet;

          setHoldData(holdCompData.holds);
          setCompData(holdCompData.comps);
          compHoldSetId = holdCompData.setId;
        }

        const booking = bookings.bookings.find((booking) => booking.Id === bookings.selected);

        setBookingSaleNotes(booking.BookingSalesNotes === null ? '' : booking.BookingSalesNotes);
        setCompNotes(booking.BookingCompNotes === null ? '' : booking.BookingCompNotes);
        setHoldNotes(booking.BookingHoldNotes === null ? '' : booking.BookingHoldNotes);
        setBookingHasSchoolSales(booking.BookingHasSchoolsSales);

        // by default - we will set the sales setId to the set connected to the sales values
        // if, for some reason, the hold/comps are set first, the setId from holds/comps will be used
        // if both are -1, it will remain -1 and the API will know to create a setId
        if (salesSetId > -1) {
          setSetId(salesSetId);
        } else if (compHoldSetId > -1) {
          setSetId(compHoldSetId);
        } else {
          setSetId(-1);
        }
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const validateSale = (saleFigure) => {
    if (isNullOrEmpty(saleFigure)) {
      return 0;
    } else {
      return parseInt(saleFigure);
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

  useEffect(() => {
    const initForm = async () => {
      try {
        let inputDate = new Date();
        if (salesDate !== null) {
          inputDate = salesDate;
        } else {
          setSalesDate(new Date());
        }

        setSalesFigures(inputDate, false);
        setSalesFigures(inputDate, true);
      } catch (error) {
        console.log(error);
      }
    };

    if (bookings.selected !== undefined && bookings.selected !== null) {
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
      setSalesDate(new Date(week));
      setSalesFigures(new Date(week), false);
      setSalesFigures(new Date(week), true);
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
                          value={currSalesFigureSet.general.seatsSold}
                          onChange={(event) =>
                            setCurrSalesFigureSet({
                              ...currSalesFigureSet,
                              general: {
                                ...currSalesFigureSet.general,
                                seatsSold: sanitiseSalesFigue(event.target.value),
                              },
                            })
                          }
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
                          value={currSalesFigureSet.general.seatsReserved}
                          onChange={(event) =>
                            setCurrSalesFigureSet({
                              ...currSalesFigureSet,
                              general: {
                                ...currSalesFigureSet.general,
                                seatsReserved: sanitiseSalesFigue(event.target.value),
                              },
                            })
                          }
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
                          value={currSalesFigureSet.general.seatsSoldVal}
                          onChange={(event) =>
                            setCurrSalesFigureSet({
                              ...currSalesFigureSet,
                              general: {
                                ...currSalesFigureSet.general,
                                seatsSoldVal: sanitiseSalesFigue(event.target.value),
                              },
                            })
                          }
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
                          value={currSalesFigureSet.general.seatsReservedVal}
                          onChange={(event) =>
                            setCurrSalesFigureSet({
                              ...currSalesFigureSet,
                              general: {
                                ...currSalesFigureSet.general,
                                seatsReservedVal: sanitiseSalesFigue(event.target.value),
                              },
                            })
                          }
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
                          onClick={copyPreviousWeeks}
                        />
                      </div>
                    </div>
                  </div>

                  {bookingHasSchoolSales ? (
                    <div>
                      <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Schools</div>

                      {schoolErrors && schoolErrors.length > 0 && (
                        <div className="flex flex-row">
                          <div className="leading-6 text-base text-primary-red font-bold mt-5">
                            {schoolErrors.map((error, index) => (
                              <div className="flex flex-row" key={index}>
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                              value={currSalesFigureSet.schools.seatsSold}
                              onChange={(event) =>
                                setCurrSalesFigureSet({
                                  ...currSalesFigureSet,
                                  schools: {
                                    ...currSalesFigureSet.schools,
                                    seatsSold: sanitiseSalesFigue(event.target.value),
                                  },
                                })
                              }
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
                              value={currSalesFigureSet.schools.seatsReserved}
                              onChange={(event) =>
                                setCurrSalesFigureSet({
                                  ...currSalesFigureSet,
                                  schools: {
                                    ...currSalesFigureSet.schools,
                                    seatsReserved: sanitiseSalesFigue(event.target.value),
                                  },
                                })
                              }
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
                              value={currSalesFigureSet.schools.seatsSoldVal}
                              onChange={(event) =>
                                setCurrSalesFigureSet({
                                  ...currSalesFigureSet,
                                  schools: {
                                    ...currSalesFigureSet.schools,
                                    seatsSoldVal: sanitiseSalesFigue(event.target.value),
                                  },
                                })
                              }
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
                              value={currSalesFigureSet.schools.seatsReservedVal}
                              onChange={(event) =>
                                setCurrSalesFigureSet({
                                  ...currSalesFigureSet,
                                  schools: {
                                    ...currSalesFigureSet.schools,
                                    seatsReservedVal: sanitiseSalesFigue(event.target.value),
                                  },
                                })
                              }
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
                                  onChange={() => editBooking('hasSchoolsSales', false)}
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
                            onChange={() => editBooking('hasSchoolsSales', true)}
                            className="w-[19px] h-[19px]"
                          />
                        </div>
                      </div>

                      <Button className="w-[132px] mt-3" variant="secondary" text="Cancel" onClick={handleCancel} />
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
                  disabled={!permissions.includes('EDIT_BOOKING_SALES_NOTES')}
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
