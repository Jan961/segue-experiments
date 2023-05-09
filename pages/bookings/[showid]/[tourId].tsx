import Link from "next/link";
import Layout from "../../../components/Layout";
import Toolbar from "../../../components/bookings/toolbar";
import SideMenu from "../../../components/sideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useState } from "react";
import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { userService } from "../../../services/user.service";
import * as React from "react";
import BookingDetailRow from "../../../components/bookings/bookingDetailRow";
import PerfomancesList from "../../../components/bookings/perfomancesList";
import { dateService } from "../../../services/dateService";
import { Simulate } from "react-dom/test-utils";
import select = Simulate.select;
import { useRouter } from "next/router";
import { tourService } from "../../../services/TourService";
import {ca, da} from "date-fns/locale";
import { GetServerSideProps } from "next";
import GlobalToolbar from "components/toolbar";
import BookingsButtons from "components/bookings/bookingsButtons";
import AddPerfomance from "../../../components/bookings/modal/AddPerfomance";
import BookingDetailsForm from "../../../components/bookings/bookingDetailsForm";
import compositionUpdate = Simulate.compositionUpdate;
import {MouseEventHandler} from "inferno";
import axios from "axios";
import {loggingService} from "../../../services/loggingService";

export default function Index({ Tour, Bookings }: any) {
  const [bookings, setBookings] = useState(null); // This is all of the bookings list
  const [selectedBooking, setSelectedBooking] = useState(null); // this should always had the first row or the selecred row
  const [currentTourID, setCurrentTourID] = useState(Tour.TourId); // this should always had the first row or the selecred row
  const [today, setToday] = useState(null); // today this section relys heavily on date
    const showid = "FTM";
    const tourid = "22"

  const router = useRouter();
  if(router.query.showid !== null &&  router.query.tourid !== null) {
      const showid = router.query.showid;
      const tourid = router.query.tourid;
  }
  const [isLoading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
        ShowDate: dateService.formDate(new Date()),
        VenueName: null,
        Capacity: 9999,
        DayTypeCast: "",
        CastLocation: "",
        DayTypeCrew: "",
        CrewLocatrion: "",
        VenueStatus: "",
        RunDays: "",
        PencilNo: "",
        Notes: "",
        PerformancePerDay: 0,
        Performance1: "",
        Performance2: "",
        BookingId: 0
  });

  const [searchFilter, setSearchFilter] = useState("");
    const [showTour, setShowTour] = useState(null);
    useEffect(() => {
    setLoading(true);

    fetch(`/api/tours/read/code/${showid}/${tourid}`)
        .then((res) => res.json())
        .then((data) => {
          fetch(`/api/bookings/${currentTourID}`)
              .then((res) => res.json())
              .then((data) => {
                setBookings(data);
                setSelectedBooking(data[0].BookingId)

                setLoading(false);
              });
        });
  }, []);


  function gotoToday() {
    return undefined;
  }

  function handleSelectDay(booking) {
  }

   async function GetBooking(bookingId: number) {

        await axios({
            method: 'GET',
            url: `/api/bookings/booking/${bookingId}`,
            data: inputs,
        })
            .then((response) => {

                alert(JSON.stringify(response))

                    let VenueName = response.data.Venue != null ? response.data.Venue.Name : "No Venue";
                    let Capacity =  response.data.Venue !== null? response.data.Venue.Seats : 0;
                    let DayTypeCast =  response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  CastLocation = response.data.Venue !== null? response.data.Venue.Seats : 0;
                    let DayTypeCrew = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  CrewLocatrion = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  VenueStatus = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  RunDays = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  PencilNo = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  Notes = response.data.Notes !== null ? response.data.Notes : "";
                   let  PerformancePerDay = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  Performance1 = response.data.Venue !== null? response.data.Venue.Seats : 0;
                   let  Performance2 = response.data.Venue !== null? response.data.Venue.Seats : 0;


                setInputs({
                    ShowDate:  dateService.formDate(response.data.ShowDate),
                    VenueName: VenueName,
                    Capacity: Capacity,
                    DayTypeCast: DayTypeCast,
                    CastLocation: CastLocation,
                    DayTypeCrew: DayTypeCrew,
                    CrewLocatrion: CrewLocatrion,
                    VenueStatus: VenueStatus,
                    RunDays: RunDays,
                    PencilNo: PencilNo,
                    Notes: Notes,
                    PerformancePerDay:PerformancePerDay,
                    Performance1: Performance1,
                    Performance2: Performance2,
                    BookingId: response.data.BookingId

            });
            })
            .catch((error) => {
                loggingService.logError(error)

            });

    }

    function handleClick(booking) {
        alert(booking)
         GetBooking(booking)
        setSelectedBooking(booking);
  }

  if (isLoading) return <p>Loading...</p>;
  if (!bookings) return <p>No Booking data, you can create one now</p>;

    const handleOnChange = (e) => {
        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    };


  function changeCapacity(e) {
    e.preventDefault()

  }
    const saveAnNext = async (e) => {
    e.preventDefault()
        saveDetails()
      setSelectedBooking(selectedBooking + 1);
      await GetBooking(selectedBooking)
  }

    const save = async (e) =>{
        e.preventDefault()
        saveDetails()
        await GetBooking(selectedBooking)
  }

    const handleServerResponse = (ok, msg) => {
        if (ok) {

            console.log("ok")
        } else {

            console.log("error")
        }
    };

  function saveDetails(){
    axios({
        method: 'POST',
        url: '/api/',
        data: inputs,
    })
        .then((response) => {
            loggingService.logAction("Booking Updated", "Booking wat updated by:" + userService.userValue.userId)
            handleServerResponse(
                true,
                'Thank you, your message has been submitted.',
            );

            handleClose()
        })
        .catch((error) => {
            handleServerResponse(false, error.response.data.error);
        });
  }
function handleClose() {

}
  return (
      <Layout title="Booking | Seque">
        <GlobalToolbar
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            title={"Bookings"}
        ></GlobalToolbar>

        {/* <Toolbar key={"toolbar"} TourID={currentTourID}></Toolbar> */}
        <BookingsButtons key={"toolbar"} TourID={currentTourID}></BookingsButtons>

        <div className="flex flex-auto">
          {/* <SideMenu></SideMenu> */}
          {/* need to pass the full list of booking*/}
          <div className="w-full p-4 overflow-y-scroll max-h-1200">
            <div className="flex flex-row w-full mb-6">
              <button className="text-primary-blue font-bold text-sm self-center mr-4 ml-4">
                Week
              </button>
              <button
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-blue px-8 py-1 text-xs font-normal leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-4/5"
                  onClick={gotoToday()}
              >
                Go to Today
              </button>
            </div>
            <ul className="grid">
              {bookings.map((booking, index) => (
                  <div
                      key={booking.BookingId}
                      id={booking.showDate}
                      className={`grid grid-cols-1 space-y-4 ${
                          index % 2 === 0 ? "bg-faded-primary-grey" : ""
                      }`}
                  >
                    <button type={"button"} onClick={() => handleClick(booking.BookingId)}>
                      <BookingDetailRow booking={booking}></BookingDetailRow>
                    </button>
                  </div>
              ))}
            </ul>
          </div>

          {selectedBooking != null ? (
              <div className="w-6/12 p-4 border-4" >
                <form className={"sticky top-0"}>
                  <div className="bg-primary-blue rounded-xl flex flex-col justify-center mb-4 ">
                    <div className="flex flex-row mx-4 mt-3 mb-1">
                      <label htmlFor="date" className=""></label>
                      <input
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.ShowDate}
                          id="Date"
                          name="Date"
                          type="date"
                          required
                          onChange={handleOnChange}
                      />

                    </div>
                    <div className="flex flex-row mx-4 mb-3 mt-1">
                      <label htmlFor="venueName" className=""></label>
                      <input
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.VenueName}
                          id="VenueName"
                          name="VenueName"
                          type="text"

                          onChange={handleOnChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row h-10 items-center mb-4">
                    <label
                        htmlFor="Capacity"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Capacity:
                    </label>

                    <input
                        className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 mr-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-4/5"
                        value={inputs.Capacity}
                        id="Capacity"
                        name="Capacity"
                        type="text"

                        onChange={handleOnChange}
                    />
                    <button
                        className="inline-flex items-center rounded-md border border-transparent bg-primary-blue px-8 py-1 text-xs font-normal leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-4/5"
                        onClick={changeCapacity}
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex flex-row mb-4">
                    <label
                        htmlFor="dayTypeCast"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Day Type: (crew)
                    </label>
                    <select className="flex flex-auto h-4/5 rounded-l-md rounded-r-md text-xs">
                      <option>Rehearsal</option>
                      <option>Show</option>
                      <option>Rest</option>
                    </select>
                  </div>
                  <div className="flex flex-row mr-0">
                    <label htmlFor="crewDetails" className="sr-only">
                      crew Details
                    </label>
                    <input
                        type="text"
                        value={inputs.Capacity}
                        id="crewDetails"
                        name="crewDetails"
                        className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
                    />
                  </div>

                  <div className="flex flex-row">
                    <label
                        htmlFor="dayTypecrew"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Day Type: (crew)
                    </label>
                    <select className="flex flex-auto m-3 h-4/5 rounded-l-md rounded-r-md text-xs mr-0">
                      <option>Fit Up</option>
                      <option>Show</option>
                      <option>Rest</option>
                    </select>
                  </div>
                  <div className="flex flex-row">
                    <label htmlFor="crewDetails" className="sr-only">
                      crew Details
                    </label>
                    <input
                        type="text"
                        id="crewDetails"
                        name="crewDetails"
                        value={inputs.Capacity}
                        className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
                    />
                  </div>
                  <div className="flex flex-row">
                    <label
                        htmlFor="venuStatus"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Venue Status:
                    </label>
                    <select className="flex flex-auto m-3 mb-1 mr-0 rounded-l-md rounded-r-md text-xs">
                      <option>Confirmed</option>
                      <option>Show</option>
                      <option>Rest</option>
                    </select>
                  </div>
                  <div className="flex flex-row">
                    <label
                        htmlFor="runDays"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Run Days:
                    </label>
                    <select className="flex flex-auto m-3 rounded-l-md rounded-r-md text-xs">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                    <label
                        htmlFor="venuStatus"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Pencil #:
                    </label>
                    <select className="flex flex-auto m-3 mr-0 rounded-l-md rounded-r-md text-xs">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  <div className="flex flex-row">
                    <label
                        htmlFor="notes"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    ></label>
                    <textarea
                        id="Notes"
                        name="Notes"
                        className="flex-auto rounded-l-md rounded-r-md w-full mb-1"
                    >{inputs.Notes}</textarea>
                  </div>

                  <div className="flex flex-row justify-between">
                    <button className="inline-flex items-center justify-center w-2/5 rounded-md border border-primary-blue
                  bg-white px-2 py-2 text-xs font-medium leading-4 text-primary-blue shadow-sm hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 ml-0"
                            onClick={save}
                    >
                      Save
                    </button>
                    <button className="inline-flex items-center justify-center w-3/5 rounded-md border border-transparent
                  bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0"
                            onClick={saveAnNext}
                    >
                      Save & go to next
                    </button>
                  </div>

                  <div className="flex flex-row">
                    <label
                        htmlFor="notes"
                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                    >
                      Performances:
                    </label>

                  </div>

                        <PerfomancesList bookingId={selectedBooking}></PerfomancesList>


                  <div className="flex flex-row justify-between mt-4">
                    <button
                        className="inline-flex items-center justify-center w-2/5 rounded-full border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 ml-0">
                      <span className="flex-grow">View Venue Info</span>
                      <div
                          className="bg-primary-blue border-2 border-white rounded-full w-5 h-5 text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faChevronRight}/>
                      </div>
                    </button>

                    <button
                        className="inline-flex items-center justify-center w-3/5 rounded-full border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0">
                      <span className="flex-grow">View Booking History</span>
                      <div
                          className="bg-primary-blue border-2 border-white rounded-full w-5 h-5 text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faChevronRight}/>
                      </div>
                    </button>
                  </div>

                  <div className="flex flex-row mt-1">
                    <p className="text-xs">Travel from previous venue: {}</p>
                  </div>
                  <div className="flex flex-row">
                    <p className="text-xs">{}</p>
                  </div>
                </form>
              </div>
          ) : null}
          {/* need to pass the first of selected */}

        </div>
      </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ShowCode = ctx.query.showid;
  const TourCode = ctx.query.tourId;

  const res = await fetch(
    `http://localhost:3000/api/tours/read/code/${ShowCode}/${TourCode}`
  );
  const tour = await res.json();

  let tourId = tour.TourId;
  const resBookings = await fetch(
    `http://localhost:3000/api/bookings/${tourId}`
  );
  const bookings = await resBookings.json();

  return {
    props: {
      Tour: tour,
      Bookings: bookings,
    },
  };
};
