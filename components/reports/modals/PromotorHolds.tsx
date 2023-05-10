

import React, { useCallback, useEffect, useState } from "react";
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import {userService} from "../../../services/user.service";
import axios from "axios";
import {dateService} from "../../../services/dateService";
import IconWithText from "../IconWithText";
import { faUser } from "@fortawesome/free-solid-svg-icons";


export default function PromotorHolds(){
    const [showModal, setShowModal] = React.useState(false);
    const [pres, setPres] = useState([]);
    const [activeTours, setActiveTours] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        DateFrom: null,
        DateTo: null,
        Tour: null,
        Venue: null
    });
    const [venues, setVenues] = useState([])
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    useEffect(() => { (async() => {
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
            .then((res) => res.json())
            .then((data) => {
                setActiveTours(data)

                setLoading(false)
            })

    })(); }, []);

    function  handleOnSubmit(e) {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));


        buildReport()
            .then(() => {
                handleServerResponse(
                    true,
                    'File Download completed.',
                );
                //handleClose()
                setShowModal(false)
                setInputs({
                    DateFrom: null,
                    DateTo: null,
                    Tour: null,
                    Venue: null

                });

            })
            .catch((error) => {
                alert("No Report could be Data: " + error)
                console.log(error)
                setInputs({
                    DateFrom: null,
                    DateTo: null,
                    Tour: null,
                    Venue: null
                });

                handleServerResponse(false, "Error");
            });


    }

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                DateFrom: null,
                DateTo: null,
                Tour: null,
                Venue: null

            });
            setShowModal(false)
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };

    async function buildReport(){

        axios({
            method: 'POST',
            url: '/api/reports/promoterHold',
            data: inputs,
        })
            .then((response) => {
                const ExcelJSWorkbook = new ExcelJS.Workbook();
                const worksheet = ExcelJSWorkbook.addWorksheet("Promoter Holds", {
                    views: [{ state: "frozen", ySplit: 4, xSplit:5 }],
                });

                worksheet.mergeCells("A1:CU1");
                const titleText = worksheet.getCell("A1");
                titleText.font = {
                    name: "Arial",
                    family: 4,
                    size: 16,
                    underline: false,
                    bold: true,
                    color: {argb: "000000"}
                };


                titleText.value = "Promoter Holds"

                let exportedDate = worksheet.getCell("A2")
                exportedDate.value =  dateService.dateToSimple(new Date()) + " "  + dateService.timeNow()

                worksheet.getCell("A3").value = "Tour"
                worksheet.getCell("B3").value = "Venue"

                worksheet.getCell("D3").value = "Show"

                worksheet.getCell("F3").value = "Available"

                worksheet.getCell("H3").value = "Allocated"


                worksheet.getCell("A4").value = "Tour"
                worksheet.getCell("B4").value = "Code"
                worksheet.getCell("C4").value = "Name"
                worksheet.getCell("D4").value = "Date"
                worksheet.getCell("E4").value = "Time"
                worksheet.getCell("F4").value = "Seats"
                worksheet.getCell("G4").value = "Notes"
                worksheet.getCell("H4").value = "Seats"
                worksheet.getCell("I4").value = "Name"
                worksheet.getCell("J4").value = "Seat Numbers"
                worksheet.getCell("K4").value = "Email"
                worksheet.getCell("L4").value = "Notes"
                worksheet.getCell("M4").value = "Requested By"
                worksheet.getCell("N4").value = "Arranged By"
                worksheet.getCell("O4").value = "Venue Confirmed"


                let firstRow = 5
                let row = 0 // simulate cells results
                let rowCount = firstRow + row


                for(let performance of response.data){

                    worksheet.getCell(rowCount, 1).value = performance.f1
                    worksheet.getCell(rowCount, 2).value = performance.f4
                    worksheet.getCell(rowCount, 3).value = performance.f5
                    worksheet.getCell(rowCount, 4).value = dateService.dateToSimple(performance.f6)
                    worksheet.getCell(rowCount, 5).value = dateService.formatTime(performance.f7)
                    worksheet.getCell(rowCount, 6).value = performance.f8
                    worksheet.getCell(rowCount, 7).value = performance.f9
                    worksheet.getCell(rowCount, 8).value = performance.f10
                    worksheet.getCell(rowCount, 9).value = performance.f11
                    worksheet.getCell(rowCount, 10).value = performance.f12
                    worksheet.getCell(rowCount, 11).value = performance.f13
                    worksheet.getCell(rowCount, 12).value = performance.f14
                    worksheet.getCell(rowCount, 13).value = performance.f15
                    worksheet.getCell(rowCount, 14).value = performance.f16
                    worksheet.getCell(rowCount, 15).value = performance.f17
                    //worksheet.getCell(rowCount, 19).value = JSON.stringify(performance)
                    rowCount = rowCount + 1
                }







                ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(
                        new Blob([buffer], {type: "application/octet-stream"}),
                        `Promoter-Holds-${new Date().toISOString()}.xlsx`
                    );
                });

               // console.log(JSON.stringify(response))
                //∂closeForm()
            })
            .catch((error) => {
                alert(error);
            });
    }


    function closeForm(){

        setInputs({
            DateFrom: null,
            DateTo: null,
            Tour: null,
            Venue: null
        })
        setVenues([])

        setShowModal(false)

    }


    async function handleOnChange(e) {

        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        if (e.target.name == "Tour") {
            // Load Venues for this tour
            setVenues([])
            await fetch(`api/tours/read/venues/${e.target.value}`)
                .then((res) => res.json())
                .then((data) => {

                    inputs.Venue = null
                    setVenues(data)
                })


        }


    }

    


    return (
        <>
        <IconWithText icon={faUser} text={"Promoter Holds"} onClick={()=> setShowModal(true)}/>

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
                                        Promoter Holds
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


                                    <div className="flex flex-row space-x-2 space-y-2">

                                        <label htmlFor="date" className="">Tour</label>

                                        <select
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.Tour}
                                            id="Tour"
                                            name="Tour"


                                            onChange={handleOnChange}>
                                            <option>Select a Tour</option>
                                            {activeTours.map((tour) => (
                                                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
                                            ))
                                            }
                                        </select>
                                    </div>
                                            <div className="flex flex-row">

                                        <label htmlFor="date" className="">From Date</label>

                                        <input
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.DateFrom}
                                            id="DateFrom"
                                            name="DateFrom"
                                            type="date"

                                            onChange={handleOnChange}


                                        />


                                    </div>
                                        <div className="flex flex-row space-x-2 space-y-2">

                                        <label htmlFor="date" className="">To Date</label>

                                        <input
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.DateTo}
                                            id="DateTo"
                                            name="DateTo"
                                            type="date"

                                            onChange={handleOnChange}


                                        />


                                    </div>

                                            <div className="flex flex-row space-x-2 space-y-2">

                                            <label htmlFor="date" className="">Venue</label>

                                            <select
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={inputs.Venue}
                                                id="Venue"
                                                name="Venue"


                                                onChange={handleOnChange}>
                                                <option key={"all"} value={null}>All</option>
                                                {venues.map((venue) => (
                                                    <option key={venue.VenueId} value={`${venue.VenueId}`}>{venue.Name}</option>
                                                ))
                                                }
                                            </select>


                                    </div>
                                    {/*footer*/}
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
                                            type="submit" > Generate Excel Report
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