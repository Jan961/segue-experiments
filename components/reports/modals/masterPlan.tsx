import ReactDOM from "react-dom";
import { reportsService } from "../../../services/reportsService";

import * as Excel from "exceljs/dist/exceljs.min.js";

import React, { useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from "xlsx";

import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from "stream";
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";
import { userService } from "../../../services/user.service";

import { forceReload } from "../../../utils/forceReload";
import { dateToSimple, formatDateUK, getMonday, getSunday, getWeekDayLong, todayToSimple, weeks } from "../../../services/dateService";
XLSX.set_cptable(cpexcel);

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import IconWithText from "../IconWithText";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function MasterPlan() {
  const [showModal, setShowModal] = React.useState(false);
  const userAccount = userService.userValue.accountId;
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
      setShowModal(false);
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
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    buildReport()
      .then(() => {
        handleServerResponse(true, "File Download completed.");
        //handleClose()
      })
      .catch((error) => {
        handleServerResponse(false, "Error");
      });
  };

  const handleClose = () => {
    setShowModal(false);
    forceReload();
  };

  async function getTourData(currentTourID) {
    await fetch(`/api/bookings/${currentTourID}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    return null;
  }

  async function getBookingData(date, TourTd) {
    await fetch(
      `/api/reports/MasterPlan/booking/5/2022-02-20"`
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    return null;
  }

  async function buildReport() {
    let firstMonday = getMonday(inputs.DateFrom);
    let sunday = getSunday(inputs.DateTo);

    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("Report");

    await fetch(
      `/api/reports/MasterPlan/shows/false/${sunday.toISOString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
      });

    worksheet.mergeCells("A1:CU1");
    const titleText = worksheet.getCell("A1");
    titleText.font = {
      name: "Arial",
      family: 4,
      size: 16,
      underline: false,
      bold: true,
      color: { argb: "FFFFFF" },
    };
    titleText.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8EA9DB" },
    };

    titleText.value =
      "Master Plan " +
      dateToSimple(firstMonday) +
      " " +
      dateToSimple(sunday);

    worksheet.mergeCells("A2:CU2");

    const exportDetails = worksheet.getCell("A2");
    exportDetails.font = {
      name: "Arial",
      family: 4,
      size: 12,
      underline: false,
      bold: true,
      color: { argb: "FFFFFF" },
    };
    exportDetails.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8EA9DB" },
    };

    exportDetails.value = "Exported: " + todayToSimple();

    var headerRow = worksheet.addRow();
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8EA9DB" },
    };
    worksheet.getRow(3).font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };

    let columns = [
      { header: "", key: "", width: 60 },
      { header: "", key: "Date", width: 60 },
    ];

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
    worksheet.getRow(3).font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };

    let columnsHead = [
      { header: "Day", key: "Day", width: 60 },
      { header: "Date", key: "Date", width: 60 },
    ];

    for (let i = 0; i < columnsHead.length; i++) {
      let currentColumnWidth = columnsHead[i].width;
      worksheet.getColumn(i + 1).width =
        currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
      let cell = headerRow.getCell(i + 1);
      cell.value = columnsHead[i].header;
    }

    let loop = new Date(firstMonday);
    let row = 6; // Set first data row
    while (loop <= sunday) {
      let day = worksheet.getCell(`A${row}`);
      let date = worksheet.getCell(`B${row}`);

      let cellDayValue = getWeekDayLong(loop);

      // Formatted row before a monday row
      if (cellDayValue == "Monday") {
        // Insert Row

        day.value = "Week Minus";
        let weekly = worksheet.getRow(row);
        weekly.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "0070C0" },
        };
        weekly.font = {
          bold: true,
          color: { argb: "FFFF00" },
        };
        row = row + 1;
        day = worksheet.getCell(`A${row}`);
        date = worksheet.getCell(`B${row}`);
      }
      day.value = cellDayValue;
      date.value = formatDateUK(loop);
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      row = row + 1;
    }

    let tourCol = "C"; // C will be first col with data

    for (let tour of tours) {
      let ShowCodeCell = worksheet.getCell(`${tourCol}${3}`);
      ShowCodeCell.value = tour.ShowCode;
      let ShowTitleCell = worksheet.getCell(`${tourCol}${4}`);
      ShowTitleCell.value = tour.ShowName + " " + tour.TourId;
      worksheet.getColumn(`${tourCol}`).width = 35;
      let TourData = await getTourData(tour.TourId);
      row = 6;
      let dataCell = worksheet.getCell(`${tourCol}${row}`);
      dataCell.value = JSON.stringify(TourData);

      let loop = new Date(firstMonday);
      while (loop <= sunday) {
        let data = worksheet.getCell(`${tourCol}${row}`);

        // Formatted row before a monday row
        if (getWeekDayLong(loop) == "Monday") {
          // Insert Row
          let cellValue = "Week " + weeks(tour.TourStartDate, loop.toISOString());
          let weekly = worksheet.getRow(row);
          data.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "0070C0" },
          };
          weekly.font = {
            bold: true,
            color: { argb: "FFFF00" },
          };

          data.value = cellValue;
          row = row + 1;
          data = worksheet.getCell(`${tourCol}${row}`);
        }
        // End Monday row

        await fetch(
          `/api/reports/MasterPlan/booking/${tour.TourId}/${loop.toISOString()}`
        )
          .then((res) => res.json())
          .then((result) => {
            if (result != null) {
              // data.value = result.Venue.Name
              if (result.Venue !== null) {
                if (result.BookingStatus == "U") {
                  data.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "8EA9DB" },
                  };
                }
                if (result.BookingStatus == "C") {
                  //HERE FOR FORMATTING LATER
                }
                if (result.BookingStatus == "X") {
                  data.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "000000" },
                  };
                  data.font = {
                    color: { argb: "FFFFFF" },
                  };
                }
                data.value = result.Venue.Name;
              } else {
                if (
                  result.DateType.DateTypeId === 2 ||
                  result.DateType.DateTypeId === 8 ||
                  result.DateType.DateTypeId === 18 ||
                  result.DateType.DateTypeId === 20
                ) {
                  data.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "ff0000" },
                  };
                  data.font = {
                    color: { argb: "FFFF00" },
                  };
                }

                data.value = result.DateType.Name;
              }
            } else {
              data.value = null;
            }
          });

        // Data row

        // Ens Data row increment for next row
        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
        row = row + 1;
      }

      tourCol = nextColumn(tourCol);
    }

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `file.xlsx`
      );
    });
  }

  return (
    <>
      <IconWithText
        icon={faUser}
        text={"Master Tour Plan"}
        onClick={() => setShowModal(true)}
      />
      {showModal ? (
        <>
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="sm:flex justify-center">
            
                  <div className="mt-3 justify-center text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-xl text-center leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Master Plan
                    </h3>
                  </div>
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleOnSubmit}>
                  <div className="mt-6">
                    <label
                      htmlFor="dateFrom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="dateFrom"
                        name="dateFrom"
                        value={inputs.DateFrom}
                        onChange={handleOnChange}
                        className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="dateTo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      type="submit"
                    >
                      {!status.submitting
                        ? !status.submitted
                          ? "Generate Excel Report"
                          : "Downloaded"
                        : "Creating Report..."}
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
