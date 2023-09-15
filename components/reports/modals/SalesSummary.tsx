import React, { useState } from "react";
import IconWithText from "../IconWithText";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { dateToSimple } from "services/dateService";
import { getCurrentMondayDate } from "services/reportsService";
import { Spinner } from "components/global/Spinner";

type Props = {
  activeTours: any[];
};

export default function SalesSummary({ activeTours }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tourWeeks, setTourWeeks] = useState([]); // Shory list of tours for the toolbar to switch

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    Tour: null,
    TourWeek: null,
    numberOfWeeks: null,
    order: null,
    tourStartDate: null,
    tourEndDate: null,
  });

  function closeForm() {
    setInputs({
      Tour: null,
      TourWeek: null,
      numberOfWeeks: null,
      order: null,
      tourStartDate: new Date(),
      tourEndDate: new Date(),
    });
    setTourWeeks([]);
    setShowModal(false);
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
  }

  async function handleOnChange(e) {
    e.persist();
    if (e.target.name === "Tour") {
      setTourWeeks([]);
      const currentTour = activeTours.find(
        (tour) => tour.Id === parseInt(e.target.value)
      );
      if (currentTour) {
        const { StartDate, EndDate } =
          currentTour.DateBlock.find((date) => date.Name === "Tour") || {};
        setInputs((prev) => ({
          ...prev,
          tourStartDate: StartDate,
          tourEndDate: EndDate,
        }));
      }
      setLoading(true);
      fetch(`/api/reports/tourWeek/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => {
          // Make sure tour weeks are empty
          setTourWeeks([]);
          // Set tour weeks with data
          setTourWeeks(data?.data || []);
          const currentWeekMonday = getCurrentMondayDate();
          setInputs((prev) => ({ ...prev, TourWeek: currentWeekMonday }));
        })
        .finally(() => {
          setLoading(false);
        });
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <>
      <IconWithText
        icon={faChartPie}
        text={"Sales Summary"}
        onClick={() => setShowModal(true)}
      />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/* content */}
              <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Sales Summary</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/* body */}
                {loading && (
                  <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
                    <Spinner className="w-full" size="lg" />
                  </div>
                )}
                <form onSubmit={handleOnSubmit}>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-lg font-medium">
                      Tour
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.Tour}
                      id="Tour"
                      name="Tour"
                      onChange={handleOnChange}
                    >
                      <option>Select a Tour</option>
                      {activeTours.map((tour) => (
                        <option key={tour.Id} value={`${tour.Id}`}>
                          {tour.ShowCode}/{tour.Code} | {tour.ShowName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <input
                      type={"hidden"}
                      name={"tourStartDate"}
                      id={"tourStartDate"}
                      value={inputs.tourStartDate}
                    />
                    <input
                      type={"hidden"}
                      name={"tourEndDate"}
                      id={"tourEndDate"}
                      value={inputs.tourEndDate}
                    />
                    {inputs.tourStartDate != null ? (
                      <p className="text-lg">
                        Tour Dates {dateToSimple(inputs.tourStartDate)} to{" "}
                        {dateToSimple(inputs.tourEndDate)}
                      </p>
                    ) : (
                      <p className="text-lg">
                        Select a Tour to populate report filters
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Tour Week
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.TourWeek}
                      id="TourWeek"
                      name="TourWeek"
                      onChange={handleOnChange}
                    >
                      {tourWeeks.map((week) => (
                        <option
                          key={week.MondayDate}
                          value={`${week.MondayDate}`}
                        >
                          {week?.Description || dateToSimple(week?.MondayDate)}{" "}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Number of weeks
                    </label>
                    <select
                      className="block w-full min-w-0 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.numberOfWeeks}
                      id="numberOfWeeks"
                      name="numberOfWeeks"
                      onChange={handleOnChange}
                    >
                      <option>Select a timespan</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                    </select>
                  </div>

                  <div className="flex flex-col my-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Order
                    </label>
                    <select
                      className="block w-full min-w-0 flex-1  shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.order}
                      id="order"
                      name="Order"
                      onChange={handleOnChange}
                    >
                      <option value={"date"}>Show Date</option>
                      <option value={"sales"}>
                        Show Sales (Low to Highest)
                      </option>
                      <option value={"change"}>
                        Change (Lowest to highest)
                      </option>
                    </select>
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => closeForm()}
                      // THis will not save anything and discard the form
                    >
                      Close and Discard
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {" "}
                      {!status.submitting
                        ? !status.submitted
                          ? "Generate Excel Report"
                          : "Downloaded"
                        : "Creating Report..."}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
