
import ReactDOM from "react-dom";
import {reportsService} from "../../../services/reportsService";

import React, { useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';



import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import {dateService} from "../../../services/dateService";
import ExcelIcon from "../../global/icons/excelIcon";
import {da} from "date-fns/locale";
import {Value} from "devextreme-react/range-selector";


export default function Report(TourID){
    const [pres, setPres] = useState([]);
    let BookingData = []
    const [isLoading, setLoading] = useState(true)

    useEffect(() => { (async() => {

        fetch(`/api/bookings/${TourID.TourID.TourID}`)
            .then((res) => res.json())
            .then((data) => {
                setPres(data)
                setLoading(false)
            })



    })(); }, []);
    if (isLoading) return <p>Loading...</p>
    function onClick() {
        //Fetch Data from API


        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("Bookings");


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
            fgColor: { argb: "8EA9DB" },
        };

        titleText.value = "Schedule for " + pres[0].Tour.Show.Name;


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
            fgColor: { argb: "8EA9DB" },
        };

        exportDetails.value = "Exported: " + dateService.todayToSimple()+ " " + dateService.timeNow();

        var headerRow = worksheet.addRow();
        worksheet.getRow(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "8EA9DB" },
        };
        worksheet.getRow(3).font = {bold: true,
            color: {argb: "FFFFFF"} };


        let columns =[
            {header: "", key: "", width: 60},
            {header: "", key: "Date", width: 60},

             // For Each Show


            // End Foreach

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
            fgColor: { argb: "8EA9DB" },
        };
        worksheet.getRow(4).font = {bold: true,
            color: {argb: "FFFFFF"} };


        let columnsHead =[
            {header: "", key: "", width: 60},
            {header: "", key: "", width: 60},
            {header: "Show", key: "", width: 60},
            {header: "", key: "", width: 30},
            {header: "", key: "", width: 120},
            {header: "", key: "", width: 60},
            {header: "", key: "", width: 60},
            {header: "Tour", key: "", width: 60},
            {header: "Perfs", key: "", width: 60},
            {header: "PERF1", key: "", width: 60},
            {header: "PERF2", key: "", width: 60},
            {header: "TRAVEL", key: "", width: 60},
            {header: "", key: "", width: 60},


        ]

        for (let i = 0; i < columnsHead.length; i++) {
            let currentColumnWidth = columnsHead[i].width;
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = columnsHead[i].header;
        }

        var headerRow1 = worksheet.addRow();
        worksheet.getRow(5).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "8EA9DB" },
        };
        worksheet.getRow(5).font = {bold: true,
            color: {argb: "FFFFFF"} };

        let columnsHeads =[
            {value: "Tour",  width: 60},
            {value: "DOW", key: "", width: 60},
            {value: "Date", key: "", width: 60},
            {value: "Week", key: "", width: 30},
            {value: "Venue/Details", key: "", width: 120},
            {value: "Town", key: "", width: 60},
            {value: "Pencil", key: "", width: 60},
            {value: "Seats", key: "", width: 60},
            {value: "/Day", key: "", width: 60},
            {value: "Time", key: "", width: 60},
            {value: "Time", key: "", width: 60},
            {value: "Mins", key: "", width: 60},
            {value: "Time", key: "", width: 60},


        ]

        for (let i = 0; i < columnsHeads.length; i++) {
            let currentColumnWidth = columnsHeads[i].width;
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow1.getCell(i + 1);
            cell.value = columnsHeads[i].value;
        }

        let dataRow = 6 // first row of data in the report

        for (let [key, value] of Object.entries(pres)) {
            let i = 0;
            let a = worksheet.getCell(`A${dataRow}`)
            a.value = value.Tour.Show.Code + value.Tour.Code

            let b = worksheet.getCell(`B${dataRow}`)
            b.value =  dateService.getWeekDay((value.ShowDate))

            let c = worksheet.getCell(`C${dataRow}`)
            c.value =  dateService.dateToSimple(value.ShowDate)

            let d = worksheet.getCell(`D${dataRow}`)
            d.value =  dateService.weeks( value.Tour.TourStartDate, value.ShowDate,)


            if (b.value === "Mon"){
                a.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F7C09B" },
                }
                b.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F7C09B" },
                }
                c.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F7C09B" },
                }
                d.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F7C09B" },
                }
            }


            /**
             * Column can hold different information Depending on the Day Type
             *
             * If it is a "show" day we have a formatted Venue otherwise we have
             * a formatted Description
             *
             * if day has no entry the value will be empty
             */
            let e = worksheet.getCell(`E${dataRow}`)

                if (value.VenueId == null) {
                    // Types need Red Letter and Yellow Background
                    if (value.DateType.DateTypeId === 2 || value.DateType.DateTypeId === 8 || value.DateType.DateTypeId === 18 || value.DateType.DateTypeId === 20) {
                        e.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "ff0000" },
                        }
                        e.font = {
                            color: {argb: "FFFF00"}
                        };

                    }

                    e.value = value.DateType.Name

                } else {

                    if (value.Venue !== null) {

                        /**
                         * Conditional formatting of this Cell
                         *
                         * U - Unconfirmed
                         * C - Confirmed
                         * X - ?
                         * " " - ?
                         */
                        if (value.BookingStatus == "U") {
                            e.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: {argb: "8EA9DB"},
                            }
                        }
                        if (value.BookingStatus == "C") {
                            //HERE FOR FORMATTING LATER
                        }
                        if (value.BookingStatus == "X") {
                        e.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "000000" },
                        }
                        e.font = {
                            color: {argb: "FFFFFF"}
                        };

                        }

                        e.value = value.Venue.Name
                    }


                    let f = worksheet.getCell(`F${dataRow}`)
                    f.value = value.Venue.Town
                }

            let g = worksheet.getCell(`G${dataRow}`)
            g.value = value.Pencil

            let h = worksheet.getCell(`H${dataRow}`)

            if (value.VenueId !== null) {
                h.value = value.Venue.Seats
                let CellI = worksheet.getCell(`I${dataRow}`)
                CellI.value = value.PerformancesPerDay

                let j = worksheet.getCell(`J${dataRow}`)
                j.value = dateService.formatTime(value.Performance1Time)

                if (value.PerformancesPerDay == 2) {
                    let k = worksheet.getCell(`K${dataRow}`)
                    k.value = dateService.formatTime(value.Performance2Time)
                }

                let l = worksheet.getCell(`L${dataRow}`)
                l.value = value.TravelTime

                let m = worksheet.getCell(`M${dataRow}`)
                m.value = value.Miles
            }






            dataRow = dataRow +1
            i = i +1;

        }


        ExcelJSWorkbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `TourSummary-${new Date()}.xlsx`
            );
        });



    }


    return (
        <>
            <button onClick={onClick}
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
                type="submit" > Tour Summary
            </button>
        </>
    );
}