import { useEffect, useMemo, useState } from "react";
import {
  dateToSimple,
  getMonday,
  getPreviousMonday,
} from "services/dateService";
import axios from "axios";
import { alertService } from "services/alert.service";
import { Spinner } from "components/global/Spinner";
import Typeahead from "components/Typeahead";
import schema from "./validation";
import { getSales } from "./Api";

type props = {
  tours?: any[];
};

type Sale = {
  Value: string;
  Seats: string;
  ReservedValue: string;
  ReservedSeats: string;
  SchoolSeats: string;
  SchoolValue: string;
};

const defaultSale = {
  Value: "",
  Seats: "",
  ReservedValue: "",
  ReservedSeats: "",
  SchoolSeats: "",
  SchoolValue: "",
};
export default function FinalSales({ tours }: props) {
  const [isLoading, setLoading] = useState(false);
  const [activeSetTourDates, setActiveSetTourDates] = useState([]);
  const [previousSaleWeek, setPreviousSaleWeek] = useState(null);
  const [finalSaleFigureDate, setFinalSaleFigureDate] = useState(null);
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });
  const [inputs, setInputs] = useState({
    SetTour: "",
    BookingId: "",
    Confirmed: false,
  });
  const isPantomime = useMemo(() => {
    const tour = tours?.find?.(
      (tour) => tour.Id === parseInt(inputs.SetTour, 10)
    );
    return tour?.ShowType === "P";
  }, [inputs?.SetTour]);
  const [sale, setSale] = useState<Sale>(defaultSale);
  const [previousSale, setPreviousSale] = useState<Sale>(defaultSale);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // setLoading(true);
  }, []);
  const handleSalesResponse = (data) => {
    const { Sale, SetSalesFiguresDate } = data || {};
    return {
      sale: Sale,
      SetSalesFiguresDate,
    };
  };
  const fetchSales = async (SetSalesFiguresDate = null, SetBookingId) => {
    setLoading(true);
    const data = await getSales({
      SetBookingId,
      isFinalFigures: true,
      SetSalesFiguresDate,
    });
    setLoading(false);
    return handleSalesResponse(data);
  };
  useEffect(() => {
    if (inputs.SetTour && inputs.BookingId) {
      setSale(defaultSale);
      setLoading(false);
      setSale(defaultSale);
      setPreviousSale(defaultSale);
      fetchSales(null, parseInt(inputs.BookingId, 10))
        .then(({ sale = {}, SetSalesFiguresDate }) => {
          setSale(sale || {});
          const nextMondayDate = getMonday(SetSalesFiguresDate);
          const previousMondayDate = getPreviousMonday(SetSalesFiguresDate);
          setFinalSaleFigureDate(nextMondayDate);
          setPreviousSaleWeek(previousMondayDate);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [inputs.SetTour, inputs.BookingId]);
  useEffect(() => {
    if (inputs.BookingId && previousSaleWeek) {
      fetchSales(previousSaleWeek, parseInt(inputs.BookingId, 10))
        .then(({ sale }) => {
          setPreviousSale(sale || {});
        })
        .catch((error) => console.log(error));
    }
  }, [inputs.BookingId, previousSaleWeek]);

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        SetTour: inputs.SetTour,
        BookingId: inputs.BookingId,
        Confirmed: inputs.Confirmed,
      });
    } else {
      // @ts-ignore
      setStatus(false);
    }
  };

  if (isLoading)
    return (
      <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-80">
        <Spinner className="w-full" size="lg" />
      </div>
    );

  /**
   * Onn update of activeSetTours
   * Venues need updated
   */
  function setTour(tourId) {
    if (tourId) {
      setLoading(true);
      axios
        .get(`/api/tours/read/venues/${tourId}`)
        .then((data) => data.data)
        .then((data) => {
          setActiveSetTourDates(data.data);
        })
        .finally(() => setLoading(false));
    }
  }

  const handleOnChange = (e) => {
    e.persist?.();
    if (e.target.name === "SetTour") {
      setTour(e.target.value);
      setInputs((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
        BookingId: null,
      }));
      return;
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSaleChange = (event: any) => {
    setSale((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  async function validateSale(sale, previousSale) {
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
        { abortEarly: false }
      )
      .then(() => {
        return true;
      })
      .catch((validationErrors) => {
        const errors = {};
        const warnings = {};
        validationErrors.inner.forEach((error) => {
          if (error.path.startsWith("warning")) {
            warnings[error.path] = error.message;
          } else {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
        return false;
      });
  }

  async function handleOnSubmit(event: any) {
    event.preventDefault?.();
    if (inputs.Confirmed === true) {
      setLoading(true);
      const valid = await validateSale(sale, previousSale);
      if (!valid) {
        setLoading(false);
        return;
      }
      const Sales = [
        {
          SaleSaleTypeId: 1,
          SaleSeats: sale?.Seats,
          SaleValue: sale?.Value,
        },
        {
          SaleSaleTypeId: 2,
          SaleSeats: sale?.ReservedSeats,
          SaleValue: sale?.ReservedValue,
        },
        {
          SaleSaleTypeId: 3,
          SaleSeats: sale?.SchoolSeats,
          SaleValue: sale?.SchoolValue,
        },
      ];
      await axios
        .post("/api/marketing/sales/upsert", {
          Sales,
          SetSalesFigureDate: finalSaleFigureDate,
          SetBookkingId: inputs.BookingId,
        })
        .then((res) => {
          handleServerResponse(true, "Submitted");
        });
    } else {
      // alertService.info("Sorry you need to confirm input", 1);
      console.log("Sorry you need to confirm input");
    }
    setLoading(false);
  }

  const copyLastWeekSalesData = () => {
    if (previousSale) {
      setSale(previousSale || defaultSale);
    }
  };

  return (
    <div className="flex flex-row w-full">
      <div className={"flex bg-pink-50 w-10/12 p-5"}>
        <div className="flex-auto mx-4 mt-0overflow-hidden  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className={"mb-1"}></div>
          <form onSubmit={handleOnSubmit}>
            <div>
              <div className=" p-4 rounded-md mb-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="SetTour"
                      className="text-sm font-medium text-gray-700"
                    >
                      Set Tour
                    </label>
                    <select
                      id="SetTour"
                      name="SetTour"
                      value={inputs.SetTour}
                      onChange={handleOnChange}
                      className="block w-full rounded-md drop-shadow-md max-w-lg border-gray-300  focus:border-primary-green focus:ring-primary-green  text-sm"
                    >
                      <option value={0}>Select A Tour</option>
                      {tours
                        ?.filter?.((tour) => !tour.IsArchived)
                        ?.map?.((tour) => (
                          <option key={tour.Id} value={tour.Id}>
                            {`${tour.ShowName} ${tour.ShowCode}/${tour.Code} ${
                              tour.IsArchived ? " | (Archived)" : ""
                            }`}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-between relative">
                    <Typeahead
                      placeholder="Venue/Date"
                      label="Venue/Date"
                      name="BookingId"
                      className="flex flex-row items-center justify-between relative [&>input]:max-w-lg"
                      dropdownClassName="max-w-lg top-[40px] right-0"
                      value={inputs?.BookingId}
                      options={activeSetTourDates.map((venue) => ({
                        text: `${venue.Code} ${venue.Name}, ${
                          venue.VenueAddressTown
                        } ${dateToSimple(venue.booking.FirstDate)}`,
                        value: String(venue.BookingId),
                      }))}
                      onChange={(option) =>
                        handleOnChange({
                          target: {
                            id: "BookingId",
                            value: option.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="columns-2">
                  <div className={"columns-1"}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="Value"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
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
                        {validationErrors?.["Value"] && (
                          <p className="text-primary-orange">
                            {validationErrors["Value"]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="Seats"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
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
                        {validationErrors["Seats"] && (
                          <p className="text-primary-orange">
                            {validationErrors["Seats"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={"columns-1"}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4   sm:pt-5">
                      <label
                        htmlFor="ReservedValue"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
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
                        {validationErrors?.["ReservedValue"] && (
                          <p className="text-primary-orange">
                            {validationErrors["ReservedValue"]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="ReservedSeats"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
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
                        {validationErrors["ReservedSeats"] && (
                          <p className="text-primary-orange">
                            {validationErrors["ReservedSeats"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {isPantomime && (
                    <div className="columns-1">
                      <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                        <label
                          htmlFor="SchoolSeats"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          School Seats Sold
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            name="SchoolSeats"
                            id="SchoolSeats"
                            value={sale?.SchoolSeats}
                            onChange={handleOnSaleChange}
                            className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                          />
                          {validationErrors?.["SchoolSeats"] && (
                            <p className="text-primary-orange">
                              {validationErrors["SchoolSeats"]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4   sm:pt-5">
                        <label
                          htmlFor="SchoolSeatsValue"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          School Seats Sold Value
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            name="SchoolSeatsValue"
                            id="SchoolSeatsValue"
                            autoComplete="SchoolSeatsValue"
                            value={sale.SchoolValue}
                            onChange={handleOnSaleChange}
                            className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                          />
                          {validationErrors?.["SchoolValue"] && (
                            <p className="text-primary-orange">
                              {validationErrors["SchoolValue"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center sm:border-t sm:border-gray-200 sm:pt-5">
                <div className="">
                  <input
                    id="Confirmed"
                    name="Confirmed"
                    type={"checkbox"}
                    checked={inputs.Confirmed}
                    onChange={handleOnChange}
                  />
                </div>
                <label
                  htmlFor="Confirmed"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 ml-4"
                >
                  I confirm these are the final figures for the above tour
                  venue/date, as agreed by all parties
                </label>
              </div>
            </div>
            <button
              type={"submit"}
              className={
                "inline-flex items-center mt-5 rounded border border-gray-300 bg-white w-100 h-16 text-grey-700 px-2.5 py-1 text-xs font-medium drop-shadow-md hover:bg-dark-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
              }
            >
              Add Sales Data
            </button>
          </form>
        </div>
      </div>
      <div className={"flex-auto flex bg-blue-100 w-2/12 p-5"}>
        <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className={"mb-1"}></div>
          <div>
            <button
              className={
                "inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              }
              disabled={!previousSaleWeek}
              onClick={copyLastWeekSalesData}
            >
              Copy Last weeks Sales Data{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
