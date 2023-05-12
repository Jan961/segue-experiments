import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { dateService } from 'services/dateService'

export default function ChangeBookingDate({BookingId, currentTourId}){
    const [showModal, setShowModal] = React.useState(false);
    const [originalDate, setOriginalDate] = useState(null);
    const [data, setData] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [newBookingDate, setNewBookingDate] = useState(null);
    const [newBookingId, setNewBookingId] = useState(null);

    // Get available Dates
    const [inputs, setInputs] = useState({
        ShowDate: "",
        BookingId: BookingId
    });


    useEffect(() => {

                if(showModal) {
                    fetch(`/api/bookings/booking/${BookingId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setData(data)
                            setInputs({
                                ShowDate: data.ShowDate,
                                BookingId: BookingId
                            })
                            setOriginalDate(data.ShowDate.substring(0, 10))

                         })

        }
    }, [BookingId, showModal]);

    useEffect(() => {
        fetch(`/api/bookings/NotBooked/${currentTourId}`)
            .then((res) => res.json())
            .then((data) => {
                setAvailableDates(data)
            })
    }, [currentTourId]);



    function handleOnSubmit(e) {
        e.preventDefault()

        alert(dateService.toSql(newBookingDate))
        // Update Booking with Date to Existing Date
        fetch(`/api/bookings/update/date`,{
            method: "POST",
            body: JSON.stringify({
                "BookingId": inputs.BookingId,
                "ShowDate":  dateService.toISO(newBookingDate)
            }),
        })

        // Update Booking to new Dare
        fetch(`/api/bookings/update/date`,{
            method: "POST",
                body: JSON.stringify({
                    "BookingId": newBookingId,
                    "ShowDate": dateService.toISO(new Date(originalDate))
                }),
            })

        //forceReload();
        setShowModal(false)
    }

    function handleOnChange(e) {

        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        let  OtherBooking = JSON.parse(e.target.value)
            setNewBookingDate(OtherBooking.date)
            setNewBookingId(OtherBooking.BookingId)


    }

    return (
        <>
            <button
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Change Date
            </button>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-6xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Change Booking Date
                                    </h3>
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
                                    <div className="flex flex-row">
                                        <div className={"flex flex-col m-2"}>
                                        <p>
                                            Warning! You are about to change the date of a booking!
                                        </p>
                                            <p>This will move the booking and all related items to the new date, inclusion contract and performances </p>
                                </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className={"flex flex-col m-2"}>
                                            Original Date: {dateService.dateToSimple(originalDate)}
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className={"flex flex-col m-2"}>

                                            <select
                                                id={"ShowDate"}
                                                name={"ShowDate"}
                                                onChange={handleOnChange}
                                                value={inputs.ShowDate}>
                                                { availableDates.length !==0 ?
                                                    availableDates.map((date, index) => (
                                                    <option id={date.BookingId} value={`\{"date":"${date.ShowDate}", "BookingId": "${date.BookingId}"\}`}>{dateService.dateToSimple(date.ShowDate)}</option>
                                                )) :null }
                                            </select>

                                        </div>
                                    </div>







                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            onClick={() => setShowModal(false)}>
                                            Close and Cancel
                                        </button>

                                        <button
                                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit"
                                        >

                                            Change Date
                                        </button>

                                    </div></form>

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    return {
        props: {

        },
    };


}
