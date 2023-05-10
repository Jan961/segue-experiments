import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faBook,
  faCalendarXmark,
  faCross,
  faFileExcel,
  faLocationDot,
  faSearch,
  faSquareXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { dateService } from "services/dateService";
import { formatPerformanceTime } from "utils/formatPerformanceTimes";

let show = "ST1"; // This needs to be passed from the template
let tour = "22";
let venue = "www.kingstheatreglasgow.net";
let landingPave = "www.kingstheatreglasgow.net/sleeping-beauty";

const Summary = ({ actionBookingId, activeTours }) => {
  const [date, setDate] = useState("");
  const [shows, setShows] = useState("");
  const [venueWeek, setVenueWeek] = useState("");
  const [totalSeatsSold, setTotalSeatsSold] = useState("");
  const [performances, setPerformances] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const [inputs, setInputs] = useState({
    DateFrom: null,
    DateTo: null,
    Tour: null,
    Venue: null,
    Selection: null,
    BookingId: null,
    ShowDate: null,
  });

  // Usage example
  // const showDate = "2023-05-01";
  // const tourStartDate = "2023-04-21";
  // const weekNumber = weeks(showDate, tourStartDate);
  // console.log("Week number:", weekNumber);

  useEffect(() => {
    if (actionBookingId) {
      (async () => {
        try {
          const response = await fetch(`/api/bookings/saleable/${actionBookingId}`);
          const data = await response.json();
          setDate(data.date);
          setShows(data.shows);
          setVenueWeek(data.venueWeek);
          setTotalSeatsSold(data.totalSeatsSold);
          getPerformances();
          getSalesSummary();
          // set the remaining state variables with the corresponding API data
        } catch (error) {
          console.error(error);
        }
        //getSaleSummary();
      })();
    }
  }, [actionBookingId]);

  async function getPerformances() {
    try {
      let response = await fetch(
        `/api/bookings/performances/performanceBookings/${actionBookingId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          let performanceTimes = data.map((obj) =>
            formatPerformanceTime(obj.Time)
          );
          setPerformances(performanceTimes);
        }
        // setPerformances(data)
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  async function getSalesSummary() {
    try {
      const response = await fetch(
        `/api/marketing/sales/marketingSales/${actionBookingId}`
      );
      console.log("Response:", response); // Debug: check the response object
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data); // Debug: check the fetched data
        setSalesSummary(data);
      } else {
        console.error("Error fetching sales summary:", response.statusText);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("salesSummary updated: ", salesSummary);
    console.log("actionBookingId:", actionBookingId); // Debug: check the value of actionBookingId

    salesSummary.forEach((sale) => {
      console.log(`Sale object :`, sale);
    });
  }, [salesSummary]);

  return (
    <div className={"flex bg-transparent w-3/12 "}>
      <div className={" h-auto clear-both"}>
        <div className="relative">
          {/* <div className="">Contacts</div> */}
          <div>
            <div>
              <div>
                {activeTours
                  .filter(
                    (tour) => Number(actionBookingId) === Number(tour.BookingId)
                  )
                  .map((tour) => {
                    const showDate = new Date(tour.ShowDate);
                    const tourStartDate = tour.Tour.TourStartDate;
                    const weekday = dateService.weeks(showDate, tourStartDate);
                    const ukDate = dateService.formatDateUK(showDate);
                    const totalSeats = tour.Venue.Seats;
                    const grossProfit = tour.GP;
                    console.log("Tour: ", tour);

                    return (
                      <div key={tour.BookingId}>
                        <>
                          <div>
                            <strong>Date: </strong> {ukDate}
                          </div>
                          <div>
                            <strong>Shows:</strong>{" "}
                            <span>{performances.join(",")}</span>
                          </div>
                          <div className={"mt-2"}>
                            {/* TBF - ADD THE VENUE WEEK */}
                            <strong>Venue Week:</strong> <span>{weekday}</span>
                          </div>

                          <div>Total seats sold: </div>

                          <div>Total sales (£): </div>
                          <div>GP (£): {grossProfit}</div>
                          <div>AVG Ticket Price (£): </div>
                          <div>Booking %: </div>
                          <div>Capacity: </div>
                          <div>Performances: {performances.length}</div>
                          <div>Total Seats: {totalSeats}</div>
                          <div>Currency: GBP</div>
                        </>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className={"mt-3"}>Marketing deal: TBA</div>
            <div>
              <strong className={"mt-5 mb-2"}>Booking Notes:</strong>
              <p>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae
                autem natura suae primae institutionis oblita est? Quem Tiberina
                descensio festo illo die tanto gaudio affecit, quanto L. Sed in
                rebus apertissimis nimium longi sumus.
              </p>
            </div>
            <div>
              <strong className={"mt-5 mb-2"}>Contract Notes:</strong>
              <p>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae
                autem natura suae primae institutionis oblita est? Quem Tiberina
                descensio festo illo die tanto gaudio affecit, quanto L. Sed in
                rebus apertissimis nimium longi sumus.
              </p>
            </div>
            <div className="border-y space-y-2">
              <div className={"mt-5"}>
                <FontAwesomeIcon icon={faUser} /> Single Seat
              </div>
              <div>
                <FontAwesomeIcon icon={faBook} /> Brochure released
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareXmark} /> Not on sale
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
function weeks(Time: any) {
  throw new Error("Function not implemented.");
}