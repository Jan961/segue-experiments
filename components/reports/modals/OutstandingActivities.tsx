import React, { useEffect, useState } from "react";

import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import {userService} from "../../../services/user.service";
import {toSql} from "../../../services/dateService";
XLSX.set_cptable(cpexcel);
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import { faListDots } from "@fortawesome/free-solid-svg-icons";
import IconWithText from "../IconWithText";

function formatWeekNumber(weekNumber){

    return  weekNumber.split(':')[1];
}

function formatDate(date){

    return  toSql(date)
}

export default function OutstandingActivities(){
    const [showModal, setShowModal] = React.useState(false);
    const [activeTours, setActiveTours] = useState([])
    const [Loading, setLoading] = useState(false);
    const [outstandingActivitiesData, seOutstandingActivityData] = useState([])


    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        Tour: null

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

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                Tour: null
            });
            setShowModal(false)
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };




    function nextColumn(column) {
        return String.fromCharCode(column.charCodeAt(0) + 1);
    }

    function closeForm(){

        setInputs({
            Tour: null
        })

        setShowModal(false)

    }

    async function buildReport() {

        const ExcelJSWorkbook = new ExcelJS.Workbook();
        const worksheet = ExcelJSWorkbook.addWorksheet("Outstanding Activities", {
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


        titleText.value = "Outstanding Activities"  //outstandingActivitiesData[0].Show.ShowName

        let HeadingsFirstRowNum = 3
        let ColNum = 1

        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "TOUR"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "SHOW"
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "DATE"
        let ShowDateColNum = ColNum

        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "VENUE"
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "CODE"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "NAME"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "TOWN"

        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "ACTIVITY"
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "TOUR WEEK"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "NAME"

        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "FOLLOW UP"
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "DUE DATE"
        let DueDateColNum = ColNum

        let LastDataColNum = ColNum

        let FirstDataRowNum = HeadingsFirstRowNum + 3
        let RowNum = FirstDataRowNum

        let CurrentTourCode = outstandingActivitiesData[0].TourCode // Set the first tour code
        /**
        for(let record of outstandingActivitiesData){

            if(CurrentTourCode != record.TourCode){
                RowNum = RowNum + 1 // Add additional line when the tour is different from the last
            }
            ColNum = 0

            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.TourCode

            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.ShowDate

            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.VenueCode
            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.VenueName
            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.VenueTown

            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = "Week " + record.ActivityTourWeek
            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.ActivityName

            ColNum = ColNum + 1
            worksheet.getCell(RowNum, ColNum).value = record.DueByDate

            // Conditional Formatting
            if(record.BookingStatus = "U") {
                worksheet.Range(worksheet.getCell(RowNum, 1), worksheet.getCell(RowNum, LastDataColNum)).Font.Italic = true
            }


            RowNum = RowNum + 1

           CurrentTourCode = record.TourCode //Set the current tour code for the next record

        }
        //RowNum = RowNum -1 //TODO see if this is needed the previoude code has been refactord to negate this line
        let LastDataRowNum = RowNum - 1
        */

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], {type: "application/octet-stream"}),
                `Sales-Summary-${new Date().toISOString()}.xlsx`
            );
        });
    }

    async function handleOnSubmit(e) {
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
                    Tour: null,

                });

            })
            .catch((error) => {
                alert("No Report could be Data: ")
                console.log(error)
                setInputs({
                    Tour: null,


                });

                handleServerResponse(false, "Error");
            });


    }

    async function  handleOnChange(e) {

        e.persist();





        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        let endpoint  = `api/tasks/activities/ActivityView/${inputs.Tour}` // Add function you want to the end of this

        /**
         * this needs a bit more debug
         *
         * Weeks need to be full weeks (Date range specified)
         * Data needs to be in range of ShowDates (ie tour dated)
         *
         */

        alert(endpoint)

        await fetch(`${endpoint}`)
            .then((res) => res.json())
            .then((data) => {
                seOutstandingActivityData(data)
            });

    }

    return (
        <>
        <IconWithText icon={faListDots} text={"Outstanding Activities"} onClick={()=> setShowModal(true)}/>
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
                                        Outstanding Activities
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
                                            type="submit" >  {!status.submitting
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
