import {GetServerSideProps} from "next";
import {useEffect, useState} from "react";
import GlobalToolbar from "../../../../components/toolbar";
import BookingsButtons from "../../../../components/bookings/bookingsButtons";
import * as React from "react";
import Layout from "../../../../components/Layout";
import BookingDetailRow from "../../../../components/bookings/bookingDetailRow";
import PerfomancesList from "../../../../components/bookings/perfomancesList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {dateService} from "../../../../services/dateService";
import {userService} from "../../../../services/user.service";
import axios from "axios";
import {loggingService} from "../../../../services/loggingService";
import VenueInfo from "../../../../components/bookings/modal/VenueInfo";
import ViewBookingHistory from "../../../../components/bookings/modal/ViewBookingHistory";


interface bookingProps {
    TourCode: string,
    ShowCode: string,
}

export default function ({TourCode, ShowCode}: bookingProps){
    const [currentTourID, setCurrentTourID] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]); // This is all of the bookings list
    const [searchFilter, setSearchFilter] = useState("");
    const [inputs, setInputs] = useState({
        ShowDate: dateService.formDate(new Date()),
        VenueId: null,
        Capacity: 0,
        DayTypeCast: "",
        CastLocation: null,
        DayTypeCrew: "",
        LocationCrew: null,
        BookingStatus: "U",
        RunDays: "",
        PencilNo: "",
        Notes: "",
        PerformancePerDay: 0,
        Performance1: "",
        Performance2: "",
        BookingId: 0
    });
    const [selectedBooking, setSelectedBooking] = useState(0);
    const [accountVenues, setAccountVenues] = useState([]);
    const [dayTypes, setDayTypes] = useState([]);

    useEffect(() => {
        fetch(`/api/venue/read/allVenues/${userService.userValue.accountId}`)
            .then((res) => res.json())
            .then((venues) => {
                setAccountVenues(venues)
            })
    }, []);

    useEffect(() => {

        // @ts-ignore
        fetch(`/api/utilities/dropdowns/dayTypes`)
            .then((res) => res.json())
            .then((dayTypes) => {
                setDayTypes(dayTypes)
            })
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/tours/read/code/${ShowCode}/${TourCode}`)
            .then((res) => res.json())
            .then((res) => {
                setCurrentTourID(res.TourId)
            });
        setLoading(false)
    }, [TourCode, ShowCode]);

    useEffect(() => {
        fetch(`/api/bookings/${currentTourID}`)
            .then((res) => res.json())
            .then((data) => {

                if(data[0] !== undefined) {
                    setSelectedBooking(data[0].BookingId)
                }
                setBookings(data);

    });
    },[currentTourID] );


    useEffect(() => {
        fetch(`/api/bookings/booking/${selectedBooking}`)
            .then((res) => res.json())
            .then((response) => {
                if (response !== null ) {
                    let VenueId = response.VenueId !== null ? response.Venue.VenueId : 0;
                    let Capacity = response.Venue !== null ? response.Venue.Seats : 0;
                    let DayTypeCast = response.DayTypeCast !== null ? response.DayTypeCast : 1;
                    let CastLocation = response.CastLocation !== null ? response.CastLocation : null;
                    let DayTypeCrew = response.DayTypeCrew !== null ? response.DayTypeCrew : 1;
                    let LocationCrew = response.LocationCrew !== null ? response.LocationCrew : null;
                    let BookingStatus = response.BookingStatus !== null ? response.BookingStatus : "U";
                    let RunDays = response.RunDays !== null ? response.RunDays : 1;
                    let PencilNo = response.PencilNo !== null ? response.PencilNo : 0;
                    let Notes = response.Notes !== null ? response.Notes : "";
                    let PerformancePerDay = response.PerformancePerDay !== null ? response.PerformancePerDay : 0;
                    let Performance1 = response.Venue !== null ? response.Venue.Seats : 0;
                    let Performance2 = response.Venue !== null ? response.Venue.Seats : 0;


                    setInputs({
                        ShowDate: dateService.formDate(response.ShowDate),
                        VenueId: VenueId,
                        Capacity: Capacity,
                        DayTypeCast: DayTypeCast,
                        CastLocation: CastLocation,
                        DayTypeCrew: DayTypeCrew,
                        LocationCrew: LocationCrew,
                        BookingStatus: BookingStatus,
                        RunDays: RunDays,
                        PencilNo: PencilNo,
                        Notes: Notes,
                        PerformancePerDay: PerformancePerDay,
                        Performance1: Performance1,
                        Performance2: Performance2,
                        BookingId: response.BookingId

                    });
                }
            })
    }, [selectedBooking]);




    if (isLoading) return <p>Loading...</p>;
    const gotoToday = () => {
       let element = new Date().toISOString().substring(0,10)
        if(document.getElementById(`${element}`) !== null) {
            document.getElementById(`${element}`).scrollIntoView({behavior: "smooth"});
        } else {
            alert("Today is not a date on this tour")
        }
    };

    function handleClick(BookingId) {
        setSelectedBooking(BookingId)
    }

    function handleOnChange(e) {
        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    }

    const changeCapacity = async (e) =>{
        e.preventDefault()

    }

    const save = async (e) =>{
        e.preventDefault()
        saveDetails()
    }
    const saveAndNext = async (e) => {
        e.preventDefault()
        saveDetails()
        setSelectedBooking(selectedBooking + 1);

    }

    function saveDetails(){
        axios({
            method: 'POST',
            url: '/api/bookings/update/',
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

    const handleServerResponse = (ok, msg) => {
        if (ok) {

            console.log("ok")
        } else {

            console.log("error")
        }
    };

    function handleClose() {

    }

    return(

            <Layout title="Booking | Seque">
                {/*<TourJumpMenu></TourJumpMenu>*/}
                <GlobalToolbar
                    searchFilter={searchFilter}
                    setSearchFilter={setSearchFilter}
                    title={"Bookings"}
                ></GlobalToolbar>

                {/* <Toolbar key={"toolbar"} TourID={currentTourID}></Toolbar> */}
                <BookingsButtons key={"toolbar"} selectedBooking={selectedBooking} currentTourId={currentTourID} ></BookingsButtons>
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
                                onClick={()=>gotoToday()}
                            >
                                Go to Today
                            </button>
                        </div>
                        <ul className="grid">
                            {bookings.map((booking, index) => (
                                <div
                                    key={new Date(booking.ShowDate).toISOString().substring(0,10)}
                                    id={booking.ShowDate.substring(0,10)}
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
                                        <select
                                            id="VenueId"
                                            name="VenueId"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            onChange={handleOnChange}
                                            value={inputs.VenueId}
                                        >
                                            <option >Please Select a Venue</option>
                                            {accountVenues.map((venue) => (
                                                <option value={venue.VenueId}>{venue.Name}</option>
                                            ))}
                                        </select>
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

                                    <select className="flex flex-auto h-4/5 rounded-l-md rounded-r-md text-xs"
                                            onChange={handleOnChange}
                                            value={inputs.DayTypeCrew}
                                            name={"DayTypeCrew"}
                                            id={"DayTypeCrew"}
                                    >
                                        <option >Please Select a Day Type</option>
                                        {dayTypes.map((dayType) => (
                                            <option value={dayType.DateTypeId}>{dayType.Name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-row mr-0">
                                    <label htmlFor="crewDetails" className="sr-only">
                                        crew Details
                                    </label>
                                    <input
                                        type="text"
                                        value={inputs.LocationCrew}
                                        id="LocationCrew"
                                        name="LocationCrew"
                                        onChange={handleOnChange}
                                        className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
                                    />
                                </div>

                                <div className="flex flex-row">
                                    <label
                                        htmlFor="dayTypecrew"
                                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                                    >
                                        Day Type: (cast)
                                    </label>

                                    <select className="flex flex-auto m-3 h-4/5 rounded-l-md rounded-r-md text-xs mr-0"
                                            onChange={handleOnChange}
                                            id="DayTypeCast"
                                            name="DayTypeCast"

                                            value={inputs.DayTypeCast}>
                                        <option >Please Select a Day Type</option>
                                        {dayTypes.map((dayType) => (
                                            <option value={dayType.DateTypeId}>{dayType.Da}{dayType.Name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-row">
                                    <label htmlFor="LocationCrew" className="sr-only">
                                        crew Details
                                    </label>
                                    <input
                                        type="text"
                                        id="CastLocation"
                                        name="CastLocation"
                                        onChange={handleOnChange}
                                        value={inputs.CastLocation}
                                        className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
                                    />
                                </div>
                                <div className="flex flex-row">
                                    <label
                                        htmlFor="BookingStatus"
                                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                                    >
                                        Venue Status:
                                    </label>
                                    <select className="flex flex-auto m-3 mb-1 mr-0 rounded-l-md rounded-r-md text-xs"
                                            value={inputs.BookingStatus}
                                            onChange={handleOnChange}
                                            id="BookingStatus"
                                            name="BookingStatus"

                                    >
                                        <option value={"C"}>Confirmed (C)</option>
                                        <option value={"U"}>Unconfirmed (U)</option>
                                        <option value={"X"}>Canceled (X)</option>
                                    </select>
                                </div>
                                <div className="flex flex-row">
                                    <label
                                        htmlFor="runDays"
                                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                                    >
                                        Run Days:
                                    </label>
                                    <select className="flex flex-auto m-3 rounded-l-md rounded-r-md text-xs"
                                            value={inputs.RunDays}
                                            onChange={handleOnChange}
                                            id="RunDays"
                                            name="RunDays">
                                        <option value={1}>{1}</option>
                                        <option value={2}>{2}</option>
                                        <option value={3}>{2}</option>
                                        <option value={4}>{4}</option>
                                        <option value={5}>{5}</option>
                                        <option value={6}>{6}</option>
                                        <option value={6}>{7}</option>
                                        <option value={8}>{8}</option>
                                        <option value={9}>{9}</option>
                                        <option value={10}>{10}</option>
                                        <option value={11}>{11}</option>
                                        <option value={12}>{12}</option>
                                        <option value={13}>{13}</option>
                                        <option value={14}>{14}</option>
                                        <option value={15}>{15}</option>
                                        <option value={16}>{16}</option>
                                        <option value={17}>{17}</option>
                                        <option value={18}>{18}</option>
                                        <option value={19}>{19}</option>
                                        <option value={20}>{20}</option>



                                    </select>
                                    <label
                                        htmlFor="venuStatus"
                                        className="flex-auto text-primary-blue font-bold text-sm self-center"
                                    >
                                        Pencil #:
                                    </label>
                                    <select className="flex flex-auto m-3 mr-0 rounded-l-md rounded-r-md text-xs"
                                            value={inputs.PencilNo}
                                            onChange={handleOnChange}
                                            id="PencilNo"
                                            name="PencilNo">
                                        <option value={1}>{1}</option>
                                        <option value={2}>{2}</option>
                                        <option value={3}>{2}</option>
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
                                        onChange={handleOnChange}
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
                                            onClick={saveAndNext}
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
                                    <VenueInfo VenueId={inputs.VenueId}></VenueInfo>
                                    <ViewBookingHistory  VenueId={inputs.VenueId}></ViewBookingHistory>
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
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const ShowCode = ctx.query.ShowCode;
    const TourCode = ctx.query.TourCode;

    return {
        props: {
            TourCode: ctx.query.TourCode,
            ShowCode: ctx.query.ShowCode,
        },
    };
};
