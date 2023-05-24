import React, {useEffect, useState} from "react";
import Button from "devextreme-react/button";
import {loggingService} from "../../../services/loggingService";
import {forceReload} from "../../../utils/forceReload";

export default function EditPerfomance({PerformanceId}){
    const [showModal, setShowModal] = React.useState(false);
    const [performance, setPerformance] = useState([]);

    function   handleOnClose(){

     setShowModal(false)
    }

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        Time: "18:30",
        BookingId: null,
        PerfomanceId: PerformanceId

    });

    useEffect(() => { (async() => {

        fetch(`/api/bookings/Performances/performance/${PerformanceId}/`)
            .then((res) => res.json())
            .then((data) => {
                setPerformance(data);
                let  time = "00:00"
                if(data.Time !== undefined){
                     time = data.Time.substring(11,16)
                } else {
                     time = "12:20"
                }
                console.log(data.Time)
                setInputs({
                    PerfomanceId: data.PerformanceId,
                    Time: time,
                    BookingId: data.Booking

                })
            })

    })(); }, [PerformanceId]);

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            forceReload()
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };
    const handleOnChange = (e) => {
        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    };
    async function handleOnSubmit(e) {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));
       await axios({
            method: 'POST',
            url: `/api/bookings/Performances/upsert`,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Barring Update", "Update Venue Barring")

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
            })
            .catch((error) => {
                loggingService.logError(error)
                handleServerResponse(false, error.response.data.error);
            });

        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null},
        });
    };


    // @ts-ignore
    return (
    <>
        <button onClick={()=> setShowModal(true)} className="inline-flex items-center rounded-md mr-1 border border-transparent bg-primary-blue px-2 py-1 text-sm font-medium
            leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Edit
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
                                    Change Performance Time
                                </h3>

                                <Button

                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                                </Button>
                            </div>
                            {/*body*/}
                            <form onSubmit={handleOnSubmit}>


                                        <div className="flex flex-row">
                                            <label htmlFor="date" className="">Time</label>
                                            <input
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={inputs.Time}
                                                id="Time"
                                                name="Time"
                                                type="time"
                                                step={60}
                                                required
                                                onChange={handleOnChange}
                                            />

                                        </div>


                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleOnClose()}
                                        // THis will not save anything and discard the form
                                    >

                                        Cancel
                                    </button>

                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg
                                        outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onClick={handleOnSubmit}
                                        type="submit" >
                                        Change Performance Time
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
