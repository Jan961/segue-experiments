import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import {userService} from "../../../services/user.service";
import {dateService} from "../../../services/dateService";
import IconWithText from "../IconWithText";
import { faChartLine, faChartPie } from "@fortawesome/free-solid-svg-icons";
XLSX.set_cptable(cpexcel);



function formatWeekNumber(weekNumber){

    return  weekNumber.split(':')[1];
}

function formatDate(date){

    return  dateService.toSql(date)
}

export default function SalesVsCapacity(){
    const [showModal, setShowModal] = React.useState(false);
    const [activeTours, setActiveTours] = useState([])
    const [tourWeeks, setTourWeeks] = useState([]) // Shory list of tours for the toolbar to switch
    const [isLoading, setLoading] = useState(false)
    const [weeks, setWeeks] = useState([]);
    const [tourSalesSummaryData, setTourSalesSummaryData] = useState([]);
    const [inputs, setInputs] = useState({
        Tour: null,
        TourWeek: null,
        numberOfWeeks: 2,
        order: null

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

    function handleOnSubmit() {

        alert("generate report")
        buildReport()

    }


    function weeksBefore(date, weeks){
        date = new Date(date)
        date.setDate(date.getDate()-7 * weeks)

        return formatDate(date.toISOString())
    }
    function weeksAfter(date, weeks){
        date = new Date(date)
        date.setDate(date.getDate()+7 * weeks)

        return formatDate(date.toISOString())
    }

    function nextColumn(column) {
        return String.fromCharCode(column.charCodeAt(0) + 1);
    }

    async function buildReport() {


        let EndDate = formatDate(inputs.TourWeek)
        let StartDate = weeksBefore(inputs.TourWeek, inputs.numberOfWeeks) //weeksBefore(EndDate, inputs.numberOfWeeks)
        let tourStartDate;
        let TourStartDate = formatDate(tourStartDate)
        let tourEndDate;
        let TourEndDate =  formatDate(tourEndDate)
        let endpoint  = `/api/reports/call/salesSummary/${inputs.Tour}/${StartDate}/${EndDate}/${TourStartDate}/${TourEndDate}/` // Add function you want to the end of this

        /**
         * this needs a bit more debug
         *
         * Weeks need to be full weeks (Date range specified)
         * Data needs to be in range of ShowDates (ie tour dated)
         *
         */

        await fetch(`${endpoint}data`)
            .then((res) => res.json())
            .then((data) => {
                setTourSalesSummaryData(data)
                fetch(`${endpoint}weeks`)
                    .then((res) => res.json())
                    .then((data) => {
                        setWeeks(data)
                    });
            });


        const ExcelJSWorkbook = new ExcelJS.Workbook();
        const worksheet = ExcelJSWorkbook.addWorksheet("Sales Summary", {
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


        titleText.value = tourSalesSummaryData[0].ShowName

        worksheet.getCell("A3").value = "Tour"
        worksheet.getCell("A4").value = "Week"
        worksheet.getCell("B4").value = "Day"
        worksheet.getCell("C4").value = "Date"
        worksheet.getCell("D4").value = "Town"
        worksheet.getCell("E4").value = "Venue"
        worksheet.getColumn("E").width = 30

        let firstRow = 5
        let row = 5 // simulate cells results
        let rowCount = firstRow + row




        let firstCol = "F" // This will be used many times
        let lastCol = "M" // THis will be dynamic
        let lastCol_1 = "N"
        let i = firstRow

        let dateCol = firstCol


        let lastDate = null
        let ShowDate = null
        let ResultCol = "F"
        for(let perf of tourSalesSummaryData){
            /**
             * Check if we need the heading row for the Showdate
             */

            if (dateService.dateStringToSimple(lastDate) != dateService.dateStringToSimple(perf.ShowDate) || lastDate === null) {
                ResultCol = "F"
                row = row + 1

                ShowDate = new Date(perf.ShowDate)
                //Com A
                worksheet.getCell(`A${row}`).value = "Week " + perf.TourWeekNum
                // ColB
                worksheet.getCell(`B${row}`).value = dateService.getWeekDay(ShowDate)
                // Colc
                worksheet.getCell(`C${row}`).value = dateService.dateStringToSimple(ShowDate)

                // COld
                worksheet.getCell(`D${row}`).value = perf.Town
                // col E
                worksheet.getCell(`E${row}`).value = perf.VenueName

                lastDate =  ShowDate
            }


            if(perf.GBPValue !== null) {
                worksheet.getCell(`${ResultCol}${row}`).value ="£" + perf.GBPValue
            } else {
                worksheet.getCell(`${ResultCol}${row}`).value = "£"+0.00
                worksheet.getCell(`${ResultCol}${row}`).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {argb: "ffff0000"},
                };

            }

            ResultCol = nextColumn(ResultCol)




        }
        ResultCol = "F"
        let LastResultCol = "F"

        /**
         * Sum Rows
         *
         */

        rowCount = row
        worksheet.getCell(`E${rowCount+1}`).value = "Total Sales £ "
        worksheet.getCell(`E${rowCount+3}`).value = "Grand Total £ "

        worksheet.getCell(`E${rowCount+5}`).value = "Weekly Increase £ "
        worksheet.getCell(`E${rowCount+6}`).value = "Weekly Increase % "

        for( let week of weeks){

            worksheet.getCell(`${dateCol}3`).value = week.WeekName
            worksheet.getCell(`${dateCol}4`).value = dateService.dateStringToSimple(week.WeekDate)
            lastCol = dateCol

            worksheet.getCell(`${dateCol}${rowCount+2}`).value = { formula: `sum(${dateCol}${firstRow}:${dateCol}${rowCount})`}
            worksheet.getCell(`${dateCol}${rowCount+4}`).value = { formula: `sum(${dateCol}${firstRow}:${lastCol_1}${rowCount})`}
            LastResultCol = dateCol

            dateCol = nextColumn(dateCol)
        }

        // Change Col
        worksheet.getCell(`${dateCol}${3}`).value = "Change Vs"
        worksheet.getCell(`${dateCol}${4}`).value = "Last Week"

        while (i < rowCount) {
            worksheet.getCell(`${dateCol}${i +1}`).value = { formula: `${LastResultCol}${i +1}:${lastCol}${i +1}`}
            i++;
        }

        worksheet.getCell(`${dateCol}${rowCount+2}`).value = { formula: `sum(${dateCol}${firstRow}:${lastCol_1}${rowCount})`}

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], {type: "application/octet-stream"}),
                `Sales-Summary-${new Date().toISOString()}.xlsx`
            );
        });
    }

    function handleOnChange(e) {


        if (e.target.name == "Tour"){
            fetch(`/api/reports/tourWeek/${e.target.value}`)
                .then((res) => res.json())
                .then((data) => {
                    setTourWeeks(data)
                })


        }


    }

    const minWeeks = 2;
    const maxWeeks = 99;

    return (
        <>
        {/* TBC replace with
         design specific Icons */}
        <IconWithText icon={faChartPie} text={"Sales VS Capacity"} onClick={()=> setShowModal(true)}/>

            {/* <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Sales VS Capacity
            </button> */}
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-6xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Sales VS Capacity %
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

                                            {activeTours.map((tour) => (
                                                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
                                            ))
                                            }
                                        </select>


                                    </div>

                                    <div className="flex flex-row space-x-2 space-y-2">
                                        <label htmlFor="date" className="">Tour Week</label>

                                        <select
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.TourWeek}
                                            id="TourWeek"
                                            name="TourWeek"


                                            onChange={handleOnChange}>

                                            {tourWeeks.map((week) => (

                                                <option key={week.TourWeekId} value={`${week.MondayDate}`}> {formatWeekNumber(week.WeekCode)} {formatDate(week.MondayDate)} </option>
                                            ))
                                            }
                                        </select>


                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="date" className="">Number of weeks</label>

                                        <select
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={inputs.numberOfWeeks}
                                            id="numberOfWeeks"
                                            name="numberOfWeeks"


                                            onChange={handleOnChange}>

                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>

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
