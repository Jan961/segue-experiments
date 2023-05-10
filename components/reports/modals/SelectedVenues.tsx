
import ReactDOM from "react-dom";
import {reportsService} from "../../../services/reportsService";

import React, { useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';

import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import Link from "next/link";
import SalesSummaryExcel from "../excelTemplates/salesSummaryExcel";
import {userService} from "../../../services/user.service";
import {dateService} from "../../../services/dateService";
XLSX.set_cptable(cpexcel);

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import { faMuseum } from "@fortawesome/free-solid-svg-icons";
import IconWithText from "../IconWithText";
export default function SelectedVenues(){
    const [showModal, setShowModal] = React.useState(false);
    const [pres, setPres] = useState([]);
    const [activeTours, setActiveTours] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [reportData, setReportData] = useState([])

    const [inputs, setInputs] = useState({
            Tour: "ALL",
            Options: "ALL",
    });

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


    async function  handleOnSubmit(e) {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));
        getReportData()
    }

    function handleOnChange(e) {
        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }


    function getReportData() {
        let endpoint  = `api/reports/SelectedVenueReport/${inputs.Tour}/${inputs.Options}`
        fetch(endpoint)
            .then((response) => response.json())
            .then((response) => {
                var ExcelJSWorkbook = new ExcelJS.Workbook();
                var worksheet = ExcelJSWorkbook.addWorksheet("Selected Venues", {
                    views: [{ state: "frozen", ySplit: 5, xSplit: 5}],
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


                titleText.value = "Selected Venues"
                let option = "ALL"
                if (inputs.Options != "null"){
                    option = inputs.Options
                }

                let title = "All Active Tours"

                if (inputs.Tour != "ALL"){
                    if(response.length > 0) {
                        title = response[0].FullTourCode + " (" + response[0].ShowName + ") "
                    } else {
                        title = "No Data for this Tour"
                    }
                }
                titleText.value =  title + " Venues: " + option

                worksheet.getCell("A3").value = "Tour"
                worksheet.getCell("A4").value = "Code"
                worksheet.getCell("B3").value = "Show"
                worksheet.getCell("B4").value = "Date"

                worksheet.getCell("C4").value = "Code"
                worksheet.getCell("D4").value = "Name"
                worksheet.getCell("E4").value = "Town"
                worksheet.getCell("F4").value = "ON SALE"


                worksheet.getCell("G3").value = "ON SALE"
                worksheet.getCell("G4").value = "Date"

                worksheet.getCell("H3").value = "MARKETING"
                worksheet.getCell("H4").value = "PLAN"

                worksheet.getCell("I3").value = "CONTACT"
                worksheet.getCell("I4").value = "INFO"

                worksheet.getCell("J3").value = "PRINT"
                worksheet.getCell("J4").value = "REQS"

                worksheet.getColumn("E").width = 30

                let firstRow = 5
                let row = 5 // simulate cells results
                let dataColPosition  = "A"

                //worksheet.getCell("E9").value = JSON.stringify(reportData)
                for(let tourDate of response){


                    //Show Detils
                    worksheet.getCell(`A${row}`).value = tourDate.FullTourCode
                    worksheet.getCell(`B${row}`).value = tourDate.ShowName

                    // Venue Detail
                    worksheet.getCell(`C${row}`).value = tourDate.VenueCode
                    worksheet.getCell(`D${row}`).value = tourDate.VenueName
                    worksheet.getCell(`E${row}`).value = tourDate.Town

                    //Date Info
                    if (tourDate.OnSale === false){
                        worksheet.getCell(`F${row}`).value = "No"
                    } else {
                        worksheet.getCell(`F${row}`).value = "Yes"
                    }

                    if(tourDate.OnSaleDate !== null) {
                        worksheet.getCell(`G${row}`).value = dateService.dateToSimple(tourDate.OnSaleDate)
                    }

                    if (tourDate.MarketingPlanReceived === false){
                        worksheet.getCell(`H${row}`).value = "No"
                    } else {
                        worksheet.getCell(`H${row}`).value = "Yes"
                    }

                    if (tourDate.ContactInfoReceived === false){
                        worksheet.getCell(`I${row}`).value = "No"
                    } else {
                        worksheet.getCell(`I${row}`).value = "Yes"
                    }

                    if (tourDate.PrintReqsReceived === false){
                        worksheet.getCell(`J${row}`).value = "No"
                    } else {
                        worksheet.getCell(`J${row}`).value = "Yes"
                    }

                    // For debugging  - this will give you the db data in col 1
                    // worksheet.getCell(`${dataColPosition}${row}`).value = JSON.stringify(tourDate)
                    row = row + 1
                }
                ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(
                        new Blob([buffer], {type: "application/octet-stream"}),
                        `Selected-Venues-${new Date().toISOString()}.xlsx`
                    );
                });
            }).then(()=>{
            setStatus((prevStatus) => ({...prevStatus, submitting: false}));
            setInputs({
                Tour: "ALL",
                Options: "null",
            });
        });
    }

    return (
        <>
        <IconWithText icon={faMuseum} text={"Selected Venues"} onClick={()=> setShowModal(true)}/>

   
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
                                        Selected Venues
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
                                            <option key="ALL" value="ALL">All</option>
                                            {activeTours.map((tour) => (
                                                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
                                            ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row space-x-2 space-y-2">
                                        <label htmlFor="date" className="">Tour</label>

                                        <select
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.Options}
                                            id="Options"
                                            name="Options"
                                            onChange={handleOnChange}>

                                            <option key="ALL" value={"null"} >All</option>
                                            <option key="ON SALE" value="ON SALE" >ON SALE</option>
                                            <option key="NOTONSALE" value="NOT ON SALE" >NOT ON SALE</option>
                                            <option key="MARKETING PLANS RECEIVED" value="MARKETING PLANS RECEIVED" >MARKETING PLANS RECEIVED</option>
                                            <option key="MARKETING PLANS NOT RECEIVED" value="MARKETING PLANS NOT RECEIVED" >MARKETING PLANS NOT RECEIVED</option>
                                            <option key="CONTACT INFO RECEIVED" value="CONTACT INFO RECEIVED" >CONTACT INFO RECEIVED</option>
                                            <option key="CONTACT INFO NOT RECEIVED" value="CONTACT INFO NOT RECEIVED" >CONTACT INFO NOT RECEIVED</option>
                                            <option key="PRINT REQUIREMENTS RECEIVED" value="PRINT REQUIREMENTS RECEIVED" >PRINT REQUIREMENTS RECEIVED</option>
                                            <option key="PRINT REQUIREMENTS NOT RECEIVED" value="PRINT REQUIREMENTS NOT RECEIVED" >PRINT REQUIREMENTS NOT RECEIVED</option>

                                        </select>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            // THis will not save anything and discard the form
                                        >

                                            Close
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" > {!status.submitting
                                            ? !status.submitted
                                                ? 'Generate Excel Report'
                                                : 'Generate Excel Report'
                                            : 'Creating Report...'}
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