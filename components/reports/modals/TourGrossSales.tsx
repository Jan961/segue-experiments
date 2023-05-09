
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
import { faSignal5 } from "@fortawesome/free-solid-svg-icons";
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
        fetch(`/api/tours/read/notArchived/${userService.userValue.accountId}`)
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
        let endpoint  = `api/reports/GrossSales/${inputs.Tour}/none`
        fetch(endpoint)
            .then((response) => response.json())
            .then((response) => {
                var ExcelJSWorkbook = new ExcelJS.Workbook();
                var worksheet = ExcelJSWorkbook.addWorksheet("Selected Venues", {
                    views: [{state: "frozen", ySplit: 5, xSplit: 5}],
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


                let title = "Gross Sales "
                if (inputs.Tour != "ALL") {
                    if (response.length > 0) {
                        title = response[0].ShowName + "(" + response[0].FullTourCode + ")"
                    } else {
                        title = "No Data for this Tour"
                    }
                }
                titleText.value = title
                worksheet.getCell("A2").value = "Exported: " + dateService.formatDateUK(new Date()) + " " + dateService.timeNow()

                let dataOutputStart = 4 // data will start from A4
                let startCol = "A"
                let col = startCol

                let tourCurrency = "GBP"
                // for weeks in tour {
                // Heading Row
               // worksheet.getCell("A3").value = JSON.stringify(response)
                let row = 5
                let colIndex = 1
                let first = 1
                let sumCurrency = [{Value: 0.00, Symbol: "£", title: "Euros"}, {
                    Value: 0.00,
                    Symbol: "€",
                    title: "Euros"
                }, {Value: 0.00, Symbol: "$", title: "US Dollars"}]
                let SumGBP = 0.00
                let SumValue = 0.00
                for (let day of response) {

                    if (first === 1 && dateService.getWeekDay(day.ShowDate) !== "Mon") {

                        // Work out how many days need be added
                        worksheet.mergeCells(row, colIndex, row, colIndex + 7);
                        let head = worksheet.getCell(5, colIndex)
                        head.border = {
                            top: {style: 'thick'},
                            left: {style: 'thick'},
                            bottom: {style: 'thick'},
                            right: {style: 'thick'}
                        }
                        head.alignment = {vertical: 'middle', horizontal: 'center'};
                        head.value = "Week" + day.TourWeekNum
                        worksheet.getCell(8, colIndex).value = "Weekly Costs"
                        worksheet.getColumn(colIndex).width = 15
                        let nextCol = 0;
                        let firstDate = new Date(day.ShowDate)
                        if (firstDate.getDay() != 0) {
                            nextCol = firstDate.getDay()
                        }

                        first = 2
                        colIndex = colIndex + nextCol

                    } else if (dateService.getWeekDay(day.ShowDate) === "Mon") {
                        worksheet.mergeCells(row, colIndex, row, colIndex + 7);
                        let head = worksheet.getCell(5, colIndex)
                        head.border = {
                            top: {style: 'thick'},
                            left: {style: 'thick'},
                            bottom: {style: 'thick'},
                            right: {style: 'thick'}
                        }
                        head.alignment = {vertical: 'middle', horizontal: 'center'};
                        head.value = "Week" + day.TourWeekNum
                        worksheet.getCell(8, colIndex).value = "Weekly Costs"
                        worksheet.getColumn(colIndex).width = 15
                        worksheet.getCell(6, colIndex).border = {

                            left: {style: 'thick'}
                        }
                        worksheet.getCell(7, colIndex).border = {

                            left: {style: 'thick'}
                        }
                        worksheet.getCell(8, colIndex).border = {

                            left: {style: 'thick'}
                        }
                        worksheet.getCell(9, colIndex).border = {

                            left: {style: 'thick'}
                        }
                        colIndex = colIndex + 1

                    }


                    worksheet.getCell(6, colIndex).value = dateService.dateToSimple(day.ShowDate)
                    worksheet.getColumn(colIndex).width = 20
                    worksheet.getCell(7, colIndex).value = dateService.getWeekDayLong(day.ShowDate)
                    worksheet.getCell(8, colIndex).value = day.Town
                    worksheet.getCell(9, colIndex).value = day.DescriptionTruncated
                    if (day.Value !== null) {
                        let dayValue = parseFloat(day.Value)
                        SumValue = SumValue + parseFloat(day.Value)
                        SumGBP = SumGBP +  parseFloat(day.GBPValue)

                        worksheet.getCell(10, colIndex).value = day.Symbol + dayValue.toFixed(2)

                    }

                colIndex = colIndex + 1
                first = 2
            }

                    let TotalsTitle = "Tour Totals"
                    let TotalCurrencyTitle  = "Total " +  tourCurrency
                    let GrandTotalTitle = "Grand Total"

                    worksheet.mergeCells(5 ,colIndex,5 ,colIndex+1);
                   let  head = worksheet.getCell(row,colIndex)
                    head.border = {
                        top: {style:'thick'},
                        left: {style:'thick'},
                        bottom: {style:'thick'},
                        right: {style:'thick'}
                    }
                    head.alignment = { vertical: 'middle', horizontal: 'center' };
                    head.value = TotalsTitle
                    worksheet.getCell(7,colIndex).value = TotalsTitle

                    worksheet.getCell(9,colIndex).value = TotalCurrencyTitle
                    worksheet.getCell(10,colIndex).value =  "£" + SumGBP
                    worksheet.getColumn(colIndex).width = 30
                    worksheet.getColumn(colIndex+1).width = 30
                    worksheet.getCell(9,colIndex+1).value = "Grand Total"
                    worksheet.getCell(10,colIndex+1).value =  "" + SumValue




                ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(
                        new Blob([buffer], {type: "application/octet-stream"}),
                        `Gross-Sales-${new Date().toISOString()}.xlsx`
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
        <IconWithText icon={faSignal5} text={"Gross Sales"} onClick={()=> setShowModal(true)}/>
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
                                        Gross Sales
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
                                            <option key="x">Select A Tour</option>
                                            {activeTours.map((tour) => (
                                                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
                                            ))
                                            }
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