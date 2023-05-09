import React, {useEffect, useState} from "react";
import {loggingService} from "../../../services/loggingService";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import {da} from "date-fns/locale";
import {userService} from "../../../services/user.service";
import EditPromoterHold from "./EditPromoterHold";
import AddPromoterHold from "./AddPromoterHold";


interface BookingHoldProps {
    bookingId: unknown
    perfomanceId: number
}

export default function PerfomanceHold({bookingId, perfomanceId}: BookingHoldProps) {
    const [showModal, setShowModal] = React.useState(false);

    let [datesList, getDatesList] = React.useState([])
    const [holdTypes, setHoldTypes] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [holds, setHolds] = useState([]);
    const [holdsCount, setHoldsCount] = useState(0);
    const [selectedHold, setSelectedHold] = useState([]);
    const [holdsAvailable, setHoldsAvailable] = useState([]);
    const [sumAvailableHoldsSeats, setSumAvailableHoldsSeats] = useState(0);
    const [sumAllocatedHoldsSeats, setSumAllocatedHoldsSeats] = useState(0);
    const [selecedAvailableHold, setSelecedAvailableHold] = useState(0);

    const [inputs, setInputs] = useState({
        TicketHolderName: "",
        Seats: 2,
        Comments: "",
        RequestedBy: "",
        ArrangedBy: userService.userValue.name,
        VenueConfirmationNotes: "",
        TicketHolderEmail: "",
        SeatsAllocated: "",
        HoldAllocationId:null

    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: {error: false, msg: null},
    });


    useEffect(() => {

        setLoading(true)

        fetch(`/api/bookings/holds/performanceHold/available`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({BookingId: bookingId, Performance: perfomanceId})})
            .then(res => res.json())
            .then(res => {
                setHoldsAvailable(res)
                if(res.length > 0) {
                    setSumAvailableHoldsSeats(res.map(a => a.Seats).reduce(function (a, b) {
                        return a + b;
                    }))
                }
            })

        setLoading(false)

    }, [perfomanceId, bookingId])



    function handleServerResponse(b: boolean, thankYouYourMessageHasBeenSubmitted: string) {

    }

    async function handleOnSubmitHold(e) {
        e.preventDefault();


        setStatus((prevStatus) => ({...prevStatus, submitting: true}));


        // This submit could be a  or an update
        if(selectedHold.length !== 0){
            // Do the update
            // @ts-ignore
            await axios({
                method: 'POST',
                url: `/api/bookings/holds/performanceHold/update/${selectedHold}`,
                data: inputs,
            })
                .then((response) => {
                    loggingService.logAction("Updated Hold", "Update Hold ")
                    handleServerResponse(
                        true,
                        'Thank you, your message has been submitted.',
                    );
                })
                .catch((error) => {
                    loggingService.logError(error)
                    handleServerResponse(false, error.response.data.error);
                });
        } else {
            //wrong en
            await axios({
                method: 'POST',
                url: `/api/bookings/holds/bookingHold/create`,
                data: inputs,
            })
                .then((response) => {
                    loggingService.logAction("Create Hold", "Add Hold ")

                    handleServerResponse(
                        true,
                        'Thank you, your message has been submitted.',
                    );
                })
                .catch((error) => {
                    loggingService.logError(error)
                    handleServerResponse(false, error.response.data.error);
                });
        }

        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null},
        });

    }


    async  function handleOnChange(e) {
        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    }


    async function selectHole(HoldAllocationId: number) {

        await fetch(`/api/bookings/holds/bookingHold/details/${HoldAllocationId}`)
            .then((res) => res.json())
            .then((data) => {

                setSelectedHold(data);

                setInputs({
                    TicketHolderName: data.TicketHolderName,
                    Seats: data.Seats,
                    Comments: data.Comments,
                    RequestedBy: data.RequestedBy,
                    ArrangedBy: data.ArrangedBy,
                    VenueConfirmationNotes: data.VenueConfirmationNotes,
                    TicketHolderEmail: data.TicketHolderEmail,
                    SeatsAllocated: data.SeatsAllocated,
                    HoldAllocationId:null
                })
            })


        //Set Inputs to Hold
    }

    async function selectAvailableHolds(Av: number) {

        fetch(`/api/bookings/holds/performanceHold/allocated/${Av}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }})
            .then(res => res.json())
            .then(res => {
                console.log("RES" + res)
                if(res.length >= 1) {
                    setSumAllocatedHoldsSeats(res.map(a => a.Seats).reduce(function (a, b) {
                        return a + b;
                    }))
                }
                setHolds(res)
            })
       setSelecedAvailableHold(Av)
        //Set Inputs to Hold
    }

    function clearSelecedHold() {
        setInputs({
                TicketHolderName: "",
                Seats: 2,
                Comments: "",
                RequestedBy: "",
                ArrangedBy: userService.userValue.name,
                VenueConfirmationNotes: "",
                TicketHolderEmail: "",
                SeatsAllocated: "",

            HoldAllocationId:null
            }
        )
        setSelectedHold([])
    }

    function deleteSelectedHold(HoldAllocationId) {

        setSelectedHold([])
        setInputs({
                TicketHolderName: "",
                Seats: 2,
                Comments: "",
                RequestedBy: "",
                ArrangedBy: userService.userValue.name,
            VenueConfirmationNotes: "",
                TicketHolderEmail: "",
                SeatsAllocated: "",

            HoldAllocationId:null
            }
        )
        //Deleted Selected Hold
        setSelectedHold([{}])
    }

    function handleOnSubmit() {
        alert("s")
    }

    function deleteBookingHold(HoldAllocationId){

        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
        axios({
            method: 'POST',
            url: `/api/bookings/holds/performanceHold/delete/${HoldAllocationId}`,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Promoter Hold Booking Delete","Change booking deleted: " + HoldAllocationId)

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
                setShowModal(false)
            })
            .catch((error) => {
                loggingService.logError( error)
                handleServerResponse(false, error.response.data.error);
            });
    }

    return (
        <div className=" max-w-2/3 flex flex-row">
            <button
                className="bg-primary-blue text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Hold
            </button>
            {showModal ? (
                    <div className="flex flex-col ">
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">Performance Hold</h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}
                                        >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <form onSubmit={handleOnSubmit}>
                                        <div className="relative p-6 flex-auto">

                                            <div className="grid grid-cols-1 gap-2">
                                                <div>
                                                    <p className={"text-gray-700 small"}>
                                                        Available Holds for this Booking
                                                    </p>
                                                </div>
                                                <div>
                                                    <table className="min-w-full">
                                                        <thead>
                                                        <tr className="bg-primary-blue ">
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 p1-4 pr-3 text-center text-sm font-normal text-white  sm:pl-6"
                                                            >
                                                                Seats
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 p1-4 pr-3 text-center text-sm font-normal text-white  sm:pl-6"
                                                            >
                                                                Notes
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className=" bg-white">
                                                        {holdsAvailable.map((hold, idx) => (
                                                            <tr onClick={() => selectAvailableHolds(hold.AvailableHoldId)} >
                                                                <td>
                                                                    {hold.Seats}
                                                                </td>
                                                                <td>
                                                                    {hold.Notes}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* If holds are available then list the Allocated Holds */}

                                            <div className="grid grid-cols-1 gap-2">
                                                <div>
                                                    <p className={"text-gray-700 small"}>
                                                        Allocated Holds Holds for this Booking
                                                    </p>
                                                </div>
                                                <div>
                                                    <table className="min-w-full">
                                                        <thead>
                                                        <tr className="bg-primary-blue ">
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 p1-4 pr-3 text-center text-sm font-normal text-white  sm:pl-6"
                                                            >
                                                                Ticket Holder Name
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border lg:table-cell"
                                                            >
                                                                Seats
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
                                                            >
                                                                Comments
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
                                                            >
                                                                Requested By
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
                                                            >
                                                                Arranged By
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
                                                            >
                                                                Venue Confirmation Notes
                                                            </th>

                                                        </tr>
                                                        </thead>
                                                        <tbody className=" bg-white">
                                                        {holds.map((hold, idx) => (
                                                            <tr key={hold.HoldAllocationId} className={idx%2 ===0?"bg-white":"bg-gray-50"} onClick={() => selectHole(hold.HoldAllocationId)}>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 lg:table-cell">
                                                                    {hold.TicketHolderName}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 lg:table-cell">
                                                                    {hold.Seats}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    {hold.Comments}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    {hold.RequestedBy}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    {hold.ArrangedBy}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    {hold.VenueConfirmationNotes}
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    <button onClick={()=>deleteBookingHold(hold.HoldAllocationId)}>Delete Hold</button>
                                                                </td>
                                                                <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                                                                    <EditPromoterHold HoldAllocationId={hold.HoldAllocationId}></EditPromoterHold>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div>
                                                    <p className={"text-gray-700 small"}>
                                                        Remaining Seats: {sumAvailableHoldsSeats-sumAllocatedHoldsSeats}/{sumAvailableHoldsSeats}
                                                        {sumAvailableHoldsSeats-sumAllocatedHoldsSeats > sumAvailableHoldsSeats ?
                                                            <>

                                                                </>
                                                        : null }
                                                    </p>
                                                </div>
                                                <AddPromoterHold AvailableHoldId={selecedAvailableHold}></AddPromoterHold>
                                            </div>

                                        </div>

                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">

                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Close
                                            </button>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </div>
            ) : null }
        </div>
    );
}

