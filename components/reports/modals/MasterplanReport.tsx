
import ReactDOM from "react-dom";
import {reportsService} from "../../../services/reportsService";

import * as Excel from "exceljs/dist/exceljs.min.js";

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
import {userService} from "../../../services/user.service";

import {forceReload} from "../../../utils/forceReload";
import {dateService} from "../../../services/dateService";
import axios from "axios";
import {wait} from "next/dist/build/output/log";
XLSX.set_cptable(cpexcel);

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";

import {da} from "date-fns/locale";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import IconWithText from "../IconWithText";

export default function MasterPlan(){
    const [showModal, setShowModal] = React.useState(false);
    const userAccount = userService.userValue.accountId
    const [tours, setTours] = useState([]);


    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        DateFrom: "2020-01-02",
        DateTo: "2023-02-01",
    });

    function nextColumn(column) {
        return String.fromCharCode(column.charCodeAt(0) + 1);
    }

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                DateFrom: inputs.DateFrom,
                DateTo: inputs.DateTo,

            });
            setShowModal(false)
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };
    function handleOnChange(e) {
        e.persist();

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
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));

        buildReport()
            .then(() => {
                handleServerResponse(
                    true,
                    'File Download completed.',
                );
                //handleClose()
            })
            .catch((error) => {
                handleServerResponse(false, "Error");
            });
    };

    const handleClose = () => {
        setShowModal(false)
        forceReload()
    };


    async function getTourData(currentTourID){

        await fetch(`http://127.0.0.1:3000/api/bookings/${currentTourID}`)
            .then((res) => res.json())
            .then((data) => {

                return data
            })

        return null
    }

    async function  buildReport(){

        let firstMonday = dateService.getMonday(inputs.DateFrom)
        let sunday = dateService.getSunday(inputs.DateTo)

        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("Report");

        await fetch(`http://127.0.0.1:3000/api/reports/MasterPlan/shows/true/${sunday.toISOString()}`)
            .then((res) => res.json())
            .then((data) => {
                setTours(data)
            });

        worksheet.mergeCells("A1:CU1");
        const titleText = worksheet.getCell("A1");
        titleText.font = {
            name: "Arial",
            family: 4,
            size: 16,
            underline: false,
            bold: true,
            color: {argb: "FFFFFF"}
        };
        titleText.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {argb: "8EA9DB"},
        };

        titleText.value = "Master Plan " + dateService.dateToSimple(firstMonday) + " " + dateService.dateToSimple(sunday);


        worksheet.mergeCells("A2:CU2");

        const exportDetails = worksheet.getCell("A2");
        exportDetails.font = {
            name: "Arial",
            family: 4,
            size: 12,
            underline: false,
            bold: true,
            color: {argb: "FFFFFF"}
        };
        exportDetails.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {argb: "8EA9DB"},
        };

        exportDetails.value = "Exported: " + dateService.todayToSimple();

        var headerRow = worksheet.addRow();
        worksheet.getRow(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {argb: "8EA9DB"},
        };
        worksheet.getRow(3).font = {
            bold: true,
            color: {argb: "FFFFFF"}
        };


        let columns = [
            {header: "", key: "", width: 60},
            {header: "", key: "Date", width: 60},
        ]

        for (let i = 0; i < columns.length; i++) {
            let currentColumnWidth = columns[i].width;
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = columns[i].header;
        }

        var headerRow = worksheet.addRow();
        worksheet.getRow(4).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {argb: "8EA9DB"},
        };
        worksheet.getRow(3).font = {
            bold: true,
            color: {argb: "FFFFFF"}
        };

        let columnsHead = [
            {header: "Day", key: "Day", width: 60},
            {header: "Date", key: "Date", width: 60},
        ]

        for (let i = 0; i < columnsHead.length; i++) {
            let currentColumnWidth = columnsHead[i].width;
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = columnsHead[i].header;
        }

        let loop = new Date(firstMonday);
        let row = 6 // Set first data row
        while (loop <= sunday) {

            let day = worksheet.getCell(`A${row}`)
            let date = worksheet.getCell(`B${row}`)

            let cellDayValue = dateService.getWeekDayLong(loop)

            // Formatted row before a monday row
            if (cellDayValue == "Monday") {
                // Insert Row

                day.value = 'Week Minus'
                let weekly = worksheet.getRow(row)
                weekly.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {argb: "0070C0"},
                };
                weekly.font = {
                    bold: true,
                    color: {argb: "FFFF00"}
                };
                row = row + 1
                day = worksheet.getCell(`A${row}`)
                date = worksheet.getCell(`B${row}`)
            }
            day.value = cellDayValue
            date.value = dateService.formatDateUK(loop)
            let newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
            row = row + 1
        }


        let tourCol = "C" // C will be first col with data



        for (let tour of tours) {
            let ShowCodeCell = worksheet.getCell(`${tourCol}${3}`)
            ShowCodeCell.value = tour.ShowCode
            let ShowTitleCell = worksheet.getCell(`${tourCol}${4}`)
            ShowTitleCell.value = tour.ShowName + " " + tour.TourId
            worksheet.getColumn(`${tourCol}`).width = 35
            let TourData = await getTourData(tour.TourId)
            row = 6
            let dataCell = worksheet.getCell(`${tourCol}${row}`)
            dataCell.value = JSON.stringify(TourData)

            let loop = new Date(firstMonday);
            while (loop <= sunday) {

                let data = worksheet.getCell(`${tourCol}${row}`)


                // Formatted row before a monday row
                if (dateService.getWeekDayLong(loop) == "Monday") {
                    // Insert Row
                    let cellValue = 'Week ' + dateService.weeks(tour.TourStartDate, loop)
                    let weekly = worksheet.getRow(row)
                    data.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "0070C0"},
                    };
                    weekly.font = {
                        bold: true,
                        color: {argb: "FFFF00"}
                    };

                    data.value = cellValue
                    row = row + 1
                    data = worksheet.getCell(`${tourCol}${row}`)
                }
                // End Monday row

                await fetch(`http://127.0.0.1:3000/api/reports/MasterPlan/booking/${tour.TourId}/${loop.toISOString()}`)
                    .then((res) => res.json())
                    .then((result) => {
                        if(result != null) {
                            // data.value = result.Venue.Name
                            if (result.Venue !== null) {
                                if (result.BookingStatus == "U") {
                                    data.fill = {
                                        type: "pattern",
                                        pattern: "solid",
                                        fgColor: {argb: "8EA9DB"},
                                    }
                                }
                                if (result.BookingStatus == "C") {
                                    //HERE FOR FORMATTING LATER
                                }
                                if (result.BookingStatus == "X") {
                                    data.fill = {
                                        type: "pattern",
                                        pattern: "solid",
                                        fgColor: { argb: "000000" },
                                    }
                                    data.font = {
                                        color: {argb: "FFFFFF"}
                                    };

                                }
                                data.value = result.Venue.Name
                            } else {
                                if (result.DateType.DateTypeId === 2 || result.DateType.DateTypeId === 8 || result.DateType.DateTypeId === 18 || result.DateType.DateTypeId === 20) {
                                    data.fill = {
                                        type: "pattern",
                                        pattern: "solid",
                                        fgColor: { argb: "ff0000" },
                                    }
                                    data.font = {
                                        color: {argb: "FFFF00"}
                                    };

                                }


                                data.value = result.DateType.Name
                            }

                        } else {
                            data.value = null
                        }
                    })

                // Data row


                // Ens Data row increment for next row
                let newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
                row = row + 1
            }



            tourCol = nextColumn(tourCol)
        }

        /**
         let Tours= [{}]
         for (let tour in Tours)
         {
            let TourShedule = [{}]
            for(let day in TourShedule)
            {
                let tourRow = 7
                let cell = tourCol + tourRow
                // @ts-ignore
                if (dateService.getWeekDay("") == "monday") {
                    // If Day is a monday insert a new row with the tour week number before entering the day details

                    worksheet.getCell(cell).value = "Week " + "weekNumber"

                    worksheet.getCell(cell).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "4472c4"},
                    };
                    worksheet.getCell(cell).font = {
                        bold: true,
                        color: {argb: "FFFF00"}
                    }
                    tourRow = tourRow +1
                    cell = tourCol + tourRow
                }
                // then add the detaild for each day below
                let day =""
                if (day === "Rehersal" || day == "Day Off"){
                    worksheet.getCell(cell).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "FF0000"},
                    };
                    worksheet.getCell(cell).font = {
                        bold: false,
                        italic: true,
                        color: {argb: "FFFF00"}
                    }

                } else if (day == "Penceled"){
                    worksheet.getCell(cell).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "FFFFFF"},
                    };
                    worksheet.getCell(cell).font = {
                        bold: false,
                        italic: true,
                        color: {argb: "FF0000"}
                    }

                } else if (day == "UNCONFIRMED"){
                    worksheet.getCell(cell).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "000000"},
                    };
                    worksheet.getCell(cell).font = {
                        bold: false,
                        italic: true,
                        color: {argb: "FFFFFFF"}
                    }

                }
                worksheet.getCell(cell).value = day

            }
            // Now that the Tour is done Build next tour
            tourCol = tourCol +1 // move to the next column
        }

         }

         */
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], {type: "application/octet-stream"}),
                `file.xlsx`
            );
        });


    }

    return (
        <>
              <IconWithText icon={faListCheck} text={"Masterplan Report"} onClick={()=> setShowModal(true)}/>

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
                                        Master Plan Report
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
                                        <label htmlFor="date" className="">First Date</label>

                                        <input
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.DateFrom}
                                            id="DateFrom"
                                            name="DateFrom"
                                            type="date"

                                            onChange={handleOnChange}


                                        />

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="date" className="">Last Date</label>

                                        <input
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.DateTo}
                                            id="DateTo"
                                            name="DateTo"
                                            type="date"

                                            onChange={handleOnChange}


                                        />

                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            // THis will not save anything and discard the form
                                        >

                                            Close and Discard
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" >
                                            {!status.submitting
                                                ? !status.submitted
                                                    ? 'Generate Excel Report'
                                                    : 'Downloaded'
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