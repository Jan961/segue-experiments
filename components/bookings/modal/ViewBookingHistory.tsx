import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function ViewBookingHistory(VenueId){
    const [showModal, setShowModal] = React.useState(false);
    const [venueData, setVenueData] = useState([]);

    useEffect(() => {
        if(showModal) {
            fetch(`/api/venue/${VenueId.VenueId}`)
                .then(res => res.json())
                .then(venueData => {
                    setVenueData(venueData)
                })

        }
    }, [VenueId, showModal]);


    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center w-3/5 rounded-full border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0">
                <span className="flex-grow">View Venue Info</span>
                <div
                    className="bg-primary-blue border-2 border-white rounded-full w-5 h-5 text-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>
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
                                        Booking History
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

                                <div className="flex flex-row">
                                    <div className={"flex flex-col m-2"}>



                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onClick={() => setShowModal(false)}>
                                        Close
                                    </button>

                                </div>

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
