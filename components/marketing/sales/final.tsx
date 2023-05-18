import { useEffect, useState } from 'react'
import Email from '../copyButton/email'
import { dateService } from 'services/dateService'
import { userService } from 'services/user.service'
import axios from 'axios'
import { alertService } from 'services/alert.service'
import { Alert } from '../../alert'
import { LoadingPage } from 'components/global/LoadingPage'


let faEnvelopeOpenOpen;
export default function FinalSales() {

    const [activeSetTours, setActiveSetTours] = useState([])
    const [activeSetTourDates, setActiveSetTourDates] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [loadedEmails, setLoadedEmails] = useState([])
    const type = 2
    const AccountId = userService.userValue.accountId

    useEffect(() => {
        setLoading(true)
        fetch (`/api/marketing/sales/emailImport/${AccountId}/${type}`)
            .then(res => res.json())
            .then(res =>{
                setLoadedEmails(res)
            })
        fetch(`/api/tours/read/notArchived/${userService.userValue.accountId}`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    "segue_admin": userService.userValue.segueAdmin,
                    "account_admin": userService.userValue.accountAdmin,
                    "user_id": userService.userValue.userId
                },
            })
            .then(res => res.json())
            .then(res => {
                setActiveSetTours(res)
                setLoading(false)
            })

    }, [])

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        SetTour: "",
        BookingId: "",
        SeatsSold: "",
        SeatsSoldValue: "",
        SchoolsSeatsSold: "",
        SchoolsSeatsSoldValue: "",
        Confirmed: false
    });

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                SetTour: inputs.SetTour,
                BookingId: inputs.BookingId,
                SeatsSold: inputs.SeatsSold,
                SeatsSoldValue: inputs.SeatsSoldValue,
                SchoolsSeatsSold: inputs.SchoolsSeatsSold,
                SchoolsSeatsSoldValue: inputs.SchoolsSeatsSoldValue,
                Confirmed: inputs.Confirmed
            });
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };

    if (isLoading) return <LoadingPage />

    /**
     * Onn update of activeSetTours
     * Venues need updated
     */
    function setTour(TourID) {
        TourID = 4
        fetch(`/api/tours/read/tourDates/${TourID}`)
            .then(res => res.json())
            .then(res => {
                setActiveSetTourDates(res)

            })

    }

    const handleOnChange = (e) => {
        e.persist();

        if(e.target.name === "SetTour"){
            setTour(e.target.value)
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

    function importEmail(id) {

        //todo: get the info form email submission and prefill the form to allwo the user to submit and do validity checking
        setInputs({
            SetTour: "",
            BookingId: "",
            SeatsSold: "",
            SeatsSoldValue: "",
            SchoolsSeatsSold: "",
            SchoolsSeatsSoldValue: "",
            Confirmed: false
        });
    }

   async function handleOnSubmit() {
        if(inputs.Confirmed === true) {
            await axios({
                method: 'POST',
                url: '/api/marketing/sales/process/entry/final',
                data: inputs,
            })
                .then((res) => {
                    handleServerResponse(true, "Submitted")
                })
        }else {
            alertService.info("Sorry you need to confirm input", 1)
        }
   }

    return (
        <>

    <div className={"flex bg-pink-50 w-9/12 p-5"}>
        <Alert></Alert>
        <div
            className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
            <div className={"mb-1"}>
            </div>
            <form onSubmit={handleOnSubmit}>
                <div className="columns-1">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="settour" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Set Tour
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <select

                                id="SetTour"
                                name="SetTour"
                                value={inputs.SetTour}
                                onChange={handleOnChange}
                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                            >
                                <option value={0}>Select A Tour</option>
                                {activeSetTours.map((item) => (
                                    <option value={item.TourId}>{item.Show.Code}/{item.Code}</option>
                                    ))}


                            </select>
                        </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="salesweek" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Venue
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <select
                                id="BookingId"
                                name="BookingId"
                                value={inputs.BookingId}
                                onChange={handleOnChange}
                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                            >
                                <option>Select A Venue</option>
                                {activeSetTourDates.map((item) => (
                                    <option value={item.BookingId}>{dateService.getWeekDay(item.ShowDate)} {dateService.dateToSimple(item.ShowDate)} {(item.Venue.Name)} ({(item.Venue.Town)})</option>
                                ))}

                            </select>
                        </div>
                    </div>

                    <div className={"columns-1"}>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Seats Sold
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    id="SeatsSold"
                                    name="SeatsSold"
                                    type={"text"}
                                    value={inputs.SeatsSold}
                                    onChange={handleOnChange}/>

                            </div>
                        </div>


                    </div>

                    <div className={"columns-1"}>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Seats Sold Value
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    id="SeatsSoldValue"
                                    name="SeatsSoldValue"
                                    type={"text"}
                                    value={inputs.SeatsSoldValue}
                                    onChange={handleOnChange}/>

                            </div>
                        </div>


                    </div>

                    <div className={"columns-1"}>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Schools Seat Sold
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    id="SchoolsSeatsSold"
                                    name="SchoolsSeatsSold"
                                    type={"text"}
                                    value={inputs.SchoolsSeatsSold}
                                    onChange={handleOnChange}/>

                            </div>
                        </div>


                    </div>

                    <div className={"columns-1"}>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Schools Seats Sold value
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    id="SchoolsSeatsSoldValue"
                                    name="SchoolsSeatsSoldValue"
                                    type={"text"}
                                    value={inputs.SchoolsSeatsSoldValue}
                                    onChange={handleOnChange}/>

                            </div>
                        </div>


                    </div>

                    <div className={"columns-1"}>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                I confirm these are the final figures for the above tour venue/date, as agreed by all parties
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input  id="Confirmed"
                                        name="Confirmed"
                                        type={"checkbox"}
                                        checked={inputs.Confirmed}
                                        onChange={handleOnChange}/>

                            </div>
                        </div>


                    </div>
                </div>

            <button
                type={"submit"}
                className={"inline-flex items-center mt-5 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}>Add
                Sales Data
            </button> </form>
            <div>
                <Email ></Email>
            </div>



    </div>

</div>
            <div   className={"flex bg-blue-100 w-9/12 p-5"}>

                <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                    <div className={"mb-1"}>


                    </div>
                    <div>
                        <button className={"inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}>Copy Last weeks Sales Data </button>

                        {loadedEmails.length > 0 &&
                            <>
                            {loadedEmails.map((item) => (
                                <div key={item.id}>
                                    <button onClick={() => importEmail(item.Id)}>
                                        <span>
                                            {JSON.stringify(item)}
                                            {item.SetTour} {dateService.dateToSimple(item.Date)} Import
                                        </span>
                                    </button>
                                </div>
                            ))
                            }
                            </>
                                }
                        {loadedEmails.length == 0 &&
                            <>
                                <span>No Emails to load</span>
                            </>
                        }
                    </div>
                </div>


            </div>

            </>
)
}


