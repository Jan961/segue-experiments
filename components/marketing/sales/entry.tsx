import { useEffect, useState, useMemo } from 'react';
import { dateToSimple } from 'services/dateService';
import axios from 'axios';
import { getSales } from './Api';
import schema from './validation';
import FormTypeahead from 'components/global/forms/FormTypeahead';
import { Spinner } from 'components/global/Spinner';

interface props {
  searchFilter: string;
  tours?: any[];
}
export default function Entry({ tours = [] }: props) {
  const [isLoading, setLoading] = useState(false);
  const [salesWeeks, SetSalesWeeks] = useState([]);
  const [salesWeeksVenues, SetSalesWeeksVenues] = useState([]);
  const [previousSaleWeek, setPreviousSaleWeek] = useState(null);
  const [options, setOptions] = useState<any>(null);
  const [holds, setHolds] = useState<any>({});
  const [comps, setComps] = useState<any>({});
  const [inputs, setInputs] = useState<any>({});
  const [sale, setSale] = useState<any>({});
  const [previousSale, setPreviousSale] = useState<any>({});
  const [notes, setNotes] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<any>({});
  // const [openWarningsDialog, setOpenWarningsDialog] = useState<boolean>(false);
  const fetchTourWeeks = (tourId) => {
    if (tourId) {
      setLoading(true);
      axios
        .get(`/api/reports/tourWeek/${tourId}`)
        .then((data: any) => SetSalesWeeks(data.data || []))
        .finally(() => setLoading(false));
    }
  };
  const fetchVenues = (tourId) => {
    if (tourId) {
      setLoading(true);
      axios
        .get(`/api/tours/read/venues/${tourId}`)
        .then((data) => data.data)
        .then((data) => {
          SetSalesWeeksVenues(data);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleSalesResponse = (data) => {
    const { Notes, SetHold, SetComp, Sale } = data || {};
    const { SalesNotes: BookingSaleNotes, CompNotes, HoldNotes } = Notes || {};
    const holdValues = SetHold?.reduce?.((holds, hold) => {
      holds[hold.HoldTypeId] = { seats: hold.HoldSeats, value: hold.HoldValue };
      return holds;
    }, {});
    const compValues = SetComp?.reduce?.((comps, comp) => {
      comps[comp.CompTypeId] = comp.CompSeats;
      return comps;
    }, {});
    return {
      holds: holdValues,
      comps: compValues,
      notes: {
        BookingSaleNotes,
        CompNotes,
        HoldNotes,
      },
      sale: Sale,
    };
  };
  const fetchSales = async (SetSalesFiguresDate, SetBookingId) => {
    setLoading(true);
    const data = await getSales({ SetSalesFiguresDate, SetBookingId });
    setLoading(false);
    return handleSalesResponse(data);
  };
  const fetchOptionTypes = () => {
    axios
      .get('/api/marketing/sales/options')
      .then((data) => {
        setOptions(data.data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchTourWeeks(inputs.SetTour);
    fetchVenues(inputs.SetTour);
  }, [inputs.SetTour]);
  useEffect(() => {
    if (!options) {
      fetchOptionTypes();
    }
  }, []);
  useEffect(() => {
    if (inputs.SaleWeek && inputs.Venue) {
      setHolds({});
      setComps({});
      setNotes({});
      setSale({});
      setLoading(false);
      fetchSales(inputs.SaleWeek, parseInt(inputs.Venue, 10))
        .then(({ holds = [], comps = [], notes, sale = {} }) => {
          setHolds(holds);
          setComps(comps);
          setNotes(notes);
          setSale(sale || {});
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [inputs.SaleWeek, inputs.Venue]);
  useEffect(() => {
    if (inputs.Venue && previousSaleWeek) {
      fetchSales(previousSaleWeek, parseInt(inputs.Venue, 10))
        .then(({ sale }) => {
          setPreviousSale(sale || {});
        })
        .catch((error) => console.log(error));
    }
  }, [inputs.Venue, previousSaleWeek]);

  const handleOnChange = (e) => {
    e.persist?.();
    setValidationErrors({});
    if (e.target.id === 'SetTour') {
      setInputs({ [e.target.id]: e.target.value });
      setSale({});
      return;
    }
    if (e.target.id === 'SaleWeek') {
      const index = salesWeeks.findIndex((week) => week.mondayDate === e.target.value);
      if (index <= 0) {
        setPreviousSaleWeek(null);
        setPreviousSale(null);
      } else {
        setPreviousSaleWeek(salesWeeks[index - 1]?.mondayDate);
      }
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleOnSaleChange = (e) => {
    e.persist?.();
    setValidationErrors({});
    setSale((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleOnNotesChange = (e) => {
    e.persist?.();
    setNotes((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  function validateSale(sale, previousSale) {
    return schema
      .validate(
        {
          ...sale,
          ...{
            PreviousSeats: previousSale?.Seats,
            PreviousValue: previousSale?.Value,
            PreviousReservedSeats: previousSale?.ReservedSeats,
            PreviousReservedValue: previousSale?.ReservedValue,
          },
        },
        { abortEarly: false },
      )
      .then(() => {
        return true;
      })
      .catch((validationErrors) => {
        const errors = {};
        const warnings = {};
        validationErrors.inner.forEach((error) => {
          if (error.path.startsWith('warning')) {
            warnings[error.path] = error.message;
          } else {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
        return false;
      });
  }

  async function onSubmit(e: any) {
    e?.preventDefault?.();
    const Holds = Object.keys(holds).map((SetHoldHoldTypeId) => ({
      SetHoldHoldTypeId: parseInt(SetHoldHoldTypeId),
      SetHoldSeats: parseInt(holds[SetHoldHoldTypeId].seats, 10),
      SetHoldValue: parseFloat(holds[SetHoldHoldTypeId].value),
    }));
    const Comps = Object.keys(comps).map((SetCompCompTypeId) => ({
      SetCompCompTypeId: parseInt(SetCompCompTypeId, 10),
      SetCompSeats: parseInt(comps[SetCompCompTypeId], 10),
    }));
    const ignoreValidation = Object.values(validationErrors).length > 0;
    if (!ignoreValidation) {
      const valid = await validateSale(sale, previousSale);
      if (!valid) {
        // setOpenWarningsDialog(true);
        return;
      }
    }
    const Sales = [
      {
        SaleSaleTypeId: 1,
        SaleSeats: parseInt(sale?.Seats, 10),
        SaleValue: parseFloat(sale?.Value),
      },
      {
        SaleSaleTypeId: 2,
        SaleSeats: parseInt(sale?.ReservedSeats, 10),
        SaleValue: parseFloat(sale?.ReservedValue),
      },
    ];
    // const validateSales
    setLoading(true);
    await axios
      .post('/api/marketing/sales/upsert', {
        Holds,
        Comps,
        Sales,
        SetBookingId: parseInt(inputs.Venue, 10),
        SetSalesFiguresDate: inputs.SaleWeek,
      })
      .then((res) => {
        console.log('Updated Sales', res);
        // setOpenWarningsDialog(false);
        setValidationErrors({});
      })
      .catch((error) => {
        console.log('Error updating Sales', error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Reserved SeatsValue
    // BookingID, date, NumSeatsSold, SeatsSoldValue, ReservedSeatsSold, ReservedSeatsValue, finalFigures

    // BookingSaleHold
    // BookingSaleID, HoldId, Seats, Value

    // BookingSaleComp
    // BookingSaleID, CompId, Seats

    // BookingSaleNotes
    // BookingSaleId, HoldNotes, CompNotes, BookingSaleNotes
  }
  const handleOnHoldsChange = (e, key) => {
    e.persist?.();
    setHolds((prev) => ({
      ...prev,
      [e.target.id]: { ...(prev?.[e.target.id] || {}), [key]: e.target.value },
    }));
  };
  const handleOnCompsChange = (e) => {
    e.persist?.();
    setComps((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const copyLastWeekSalesData = () => {
    if (previousSale) {
      setSale(previousSale || {});
    }
  };

  const typeaheadOptions = useMemo(() => {
    return salesWeeksVenues.map((venue) => ({
      name: `${venue.Code} ${venue.Name}, ${venue.Town} ${dateToSimple(venue.booking.FirstDate)}`,
      value: String(venue.BookingId),
    }));
  }, [salesWeeksVenues]);

  if (isLoading) {
    return (
      <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-80">
        <Spinner className="w-full" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full">
      <div className={'flex bg-transparent w-5/8'}>
        <div className="flex-auto mx-4 mt-0overflow-hidden  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className={'mb-1'}></div>
          <form onSubmit={onSubmit}>
            <div>
              <div className="bg-soft-primary-green p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {/* Set Tour */}
                  <div className="row-start-1 flex flex-row items-center">
                    <label htmlFor="SetTour" className="w-48 mr-6 text-sm font-medium text-gray-700">
                      Set Tour
                    </label>
                    <select
                      id="SetTour"
                      name="SetTour"
                      value={inputs.SetTour}
                      onChange={handleOnChange}
                      className="ml-1 block w-full rounded-md drop-shadow-md max-w-lg border-gray-300  focus:border-primary-green focus:ring-primary-green text-sm"
                    >
                      <option value={0}>Select A Tour</option>
                      {tours
                        ?.filter?.((tour) => !tour.IsArchived)
                        ?.map?.((tour) => (
                          <option key={tour.Id} value={tour.Id}>
                            {`${tour.ShowName} ${tour.ShowCode}${tour.Code} ${tour.IsArchived ? ' | (Archived)' : ''}`}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Tour Sale Week */}
                  <div className="row-start-2 flex flex-row items-center">
                    <label htmlFor="SaleWeek" className="w-48 mr-6 text-sm font-medium text-gray-700">
                      Tour Sale Week
                    </label>
                    <select
                      id="SaleWeek"
                      name="SaleWeek"
                      value={inputs.SaleWeek}
                      className="ml-1 block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green text-sm"
                      onChange={handleOnChange}
                    >
                      <option value={0}>Select Tour Week</option>
                      {salesWeeks
                        ?.sort?.((a, b) => new Date(a.mondayDate).valueOf() - new Date(b.mondayDate).valueOf())
                        ?.map?.((week) => (
                          <option key={week.mondayDate} value={week.mondayDate}>
                            {`Wk ${week.tourWeekNum} | Monday ${dateToSimple(new Date(week.mondayDate))}`}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Venue/Date */}
                  <div className="row-start-3 row-span-2 flex flex-row items-center relative">
                    <label htmlFor="SaleWeek" className="w-48 mr-6 text-sm font-medium text-gray-700">
                      Venue/Date
                    </label>
                    <FormTypeahead
                      placeholder="Venue/Date"
                      name="Venue"
                      className="ml-1 block w-full max-w-lg rounded-md"
                      value={inputs.Venue}
                      options={typeaheadOptions}
                      onChange={(selectedOption) =>
                        handleOnChange({
                          target: {
                            id: 'Venue',
                            value: selectedOption, // Ensure this is a string or number
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                    <label htmlFor="Value" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Sold Seat Value
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="Value"
                        id="Value"
                        value={sale?.Value}
                        onChange={handleOnSaleChange}
                        className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                      {validationErrors?.Value && <p className="text-primary-orange">{validationErrors.Value}</p>}
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                    <label htmlFor="Seats" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Seats Sold
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="Seats"
                        id="Seats"
                        autoComplete="Seats"
                        value={sale.Seats}
                        onChange={handleOnSaleChange}
                        className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                      {validationErrors.Seats && <p className="text-primary-orange">{validationErrors.Seats}</p>}
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4   sm:pt-5">
                    <label htmlFor="ReservedValue" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Reserved Seats Value
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="ReservedValue"
                        id="ReservedValue"
                        autoComplete="ReservedValue"
                        value={sale.ReservedValue}
                        onChange={handleOnSaleChange}
                        className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                      {validationErrors?.ReservedValue && (
                        <p className="text-primary-orange">{validationErrors.ReservedValue}</p>
                      )}
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                    <label htmlFor="ReservedSeats" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Reserved Seats
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="ReservedSeats"
                        id="ReservedSeats"
                        autoComplete="ReservedSeats"
                        value={sale.ReservedSeats}
                        onChange={handleOnSaleChange}
                        className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                      {validationErrors.ReservedSeats && (
                        <p className="text-primary-orange">{validationErrors.ReservedSeats}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-cols-2 grid gap-4  md:gap-6 pt-4">
                <div className="sm:col-span-1">
                  <div className={'flex flex-col'}>
                    <div className=" bg-dark-primary-green text-white rounded-t-md px-2 sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:border-t sm:border-gray-200 sm:py-2">
                      <span className=" sm:col-span-1 sm:mt-0">Holds</span>
                      <span className=" sm:col-span-1 text-center sm:mt-0">Seats</span>
                      <span className=" sm:col-span-1 text-center sm:mt-0">Value</span>
                    </div>
                    {options?.holdTypes.map((hold, i) => (
                      <div
                        key={i}
                        className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5"
                      >
                        <label
                          htmlFor={hold.HoldTypeId}
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          {hold.HoldTypeName}
                        </label>
                        <div className="mt-1 sm:col-span-1 sm:mt-0">
                          <input
                            type="text"
                            name={hold.HoldTypeId}
                            id={hold.HoldTypeId}
                            autoComplete="PressHoldsSeats"
                            value={holds?.[hold.HoldTypeId]?.seats}
                            onChange={(e) => handleOnHoldsChange(e, 'seats')}
                            className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                          />
                        </div>
                        <div className="mt-1 sm:col-span-1 sm:mt-0">
                          <input
                            type="text"
                            name={hold.HoldTypeId}
                            id={hold.HoldTypeId}
                            autoComplete="PressHoldsValue"
                            value={holds?.[hold.HoldTypeId]?.value}
                            onChange={(e) => handleOnHoldsChange(e, 'value')}
                            className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={'col-span-1'}>
                  <div className="sm:grid bg-dark-primary-green text-white sm:grid-cols-3 px-2 sm:items-start sm:gap-4 rounded-t-md sm:border-none sm:border-gray-200 py-2">
                    <span className="sm:col-span-1">Comps</span>
                    <span className="text-center sm:col-span-2 ">Seats</span>
                  </div>
                  {options?.compTypes?.map((comp, j) => (
                    <div
                      key={j}
                      className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        htmlFor={comp.CompTypeId}
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        {comp.CompTypeName}
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name={comp.CompTypeId}
                          id={comp.CompTypeId}
                          autoComplete="PressSeats"
                          value={comps?.[comp.CompTypeId]}
                          onChange={handleOnCompsChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={'columns-1'}>
                <div className="sm:grid sm:grid-cols-2 px-2 sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                  <div className="flex flex-col w-full col-span-1 cursor-not-allowed">
                    <label htmlFor="HoldNotes" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Hold Notes
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0 cursor-not-allowed">
                      <textarea
                        className="w-full cursor-not-allowed"
                        onChange={handleOnNotesChange}
                        name={'HoldNotes'}
                        id={'HoldNotes'}
                        value={notes.HoldNotes}
                        disabled
                      ></textarea>
                    </div>
                  </div>
                  <div className={'col-span-1'}>
                    <div className="flex flex-col px-2 sm:border-none sm:border-gray-200 w-full cursor-not-allowed">
                      <label htmlFor="CompNotes" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Comp Notes
                      </label>
                      <div className="mt-1 sm:mt-0">
                        <textarea
                          onChange={handleOnNotesChange}
                          name={'CompNotes'}
                          id={'CompNotes'}
                          value={notes.CompNotes}
                          className="w-full cursor-not-allowed"
                          disabled
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'flex flex-col'}>
                <label htmlFor="BookingSaleNotes" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Booking Sale Notes
                </label>
                <div className="mt-1 sm:mt-0 w-full">
                  <textarea
                    onChange={handleOnNotesChange}
                    name={'BookingSaleNotes'}
                    id={'BookingSaleNotes'}
                    value={notes.BookingSaleNotes}
                    className="w-full cursor-not-allowed"
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={'ml-4 flex bg-transparent flex flex-col w-1/3'}>
        <div className="grid grid-cols-2 gap-1 mb-4">
          <button
            type={'submit'}
            onClick={onSubmit}
            className={
              ' rounded border border-gray-300 bg-primary-green w-100 h-16 text-white px-2.5 py-1.5 drop-shadow-md hover:bg-dark-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2'
            }
          >
            {Object.values(validationErrors).length ? 'Update anyway' : 'Add Sales Data'}
          </button>
          <button
            disabled={!previousSaleWeek}
            onClick={copyLastWeekSalesData}
            className=" rounded border border-gray-300 bg-primary-green w-100 h-16 text-white px-2.5 py-1.5 drop-shadow-md hover:bg-dark-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
          >
            Copy Last Week Sales Data
          </button>
        </div>
        <div className="flex-auto mx-4 mt-0 overflow-hidden max-h-screen border-primary-green border ring-opacity-5 sm:-mx-6 md:mx-0 ">
          <div className={'mb-1'}></div>
        </div>
      </div>
    </div>
  );
}
