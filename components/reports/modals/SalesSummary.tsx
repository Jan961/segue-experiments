import ReactDOM from "react-dom";
import { reportsService } from "../../../services/reportsService";

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
import Link from "next/link";
import SalesSummaryExcel from "../excelTemplates/salesSummaryExcel";
import { userService } from "../../../services/user.service";
import { dateService } from "../../../services/dateService";
XLSX.set_cptable(cpexcel);
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import { Alert } from "../../alert";
import { da } from "date-fns/locale";
import IconWithText from "../IconWithText";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

function formatWeekNumber(weekNumber) {
  return weekNumber.split(":")[1];
}

function formatDate(date) {
  return dateService.toSql(date);
}

export default function SalesSummary() {
  const [showModal, setShowModal] = React.useState(false);
  const [activeTours, setActiveTours] = useState([]);
  const [tourWeeks, setTourWeeks] = useState([]); // Shory list of tours for the toolbar to switch
  const [isLoading, setLoading] = useState(false);
  const [tourStartDate, setTourStartDate] = useState(null);
  const [tourEndDate, setTourEndDate] = useState(null);

  const [tourSalesSummaryData, setTourSalesSummaryData] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    Tour: null,
    TourWeek: null,
    numberOfWeeks: null,
    order: null,
    tourStartDate: null,
    tourEndDate: null,
  });

  useEffect(() => {
    (async () => {
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
          setActiveTours(data);

          setLoading(false);
        });
    })();
  }, []);

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        Tour: null,
        TourWeek: null,
        numberOfWeeks: null,
        order: null,
        tourStartDate: null,
        tourEndDate: null,
      });
      setShowModal(false);
    } else {
      // @ts-ignore
      setStatus(false);
    }
  };

  function weeksBefore(date, weeks) {
    let weeksBefore = dateService.getDateDaysAgo(date, weeks);
    return weeksBefore;
  }
  function weeksAfter(date, weeks) {
    date = new Date(date);
    console.log(date);
    date.setDate(date.getDate() - 7 * weeks);

    return formatDate(date);
  }

  function nextColumn(column) {
    return String.fromCharCode(column.charCodeAt(0) + 1);
  }

  function closeForm() {
    setInputs({
      Tour: null,
      TourWeek: null,
      numberOfWeeks: null,
      order: null,
      tourStartDate: new Date(),
      tourEndDate: new Date(),
    });
    setTourWeeks([]);
    setTourStartDate(null);
    setTourEndDate(null);

    setShowModal(false);
  }

  async function buildReport() {
    let EndDate = formatDate(inputs.TourWeek);
    let StartDate = weeksBefore(inputs.TourWeek, inputs.numberOfWeeks); //weeksBefore(EndDate, inputs.numberOfWeeks)
    let TourStartDate = formatDate(tourStartDate);
    let TourEndDate = formatDate(tourEndDate);
    let endpoint = `/api/reports/call/salesSummary/${inputs.Tour}/${StartDate}/${EndDate}/${TourStartDate}/${TourEndDate}/`; // Add function you want to the end of this

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
        setTourSalesSummaryData(data);
        fetch(`${endpoint}weeks`)
          .then((res) => res.json())
          .then((data) => {
            setWeeks(data);
          });
      });

    const ExcelJSWorkbook = new ExcelJS.Workbook();
    const worksheet = ExcelJSWorkbook.addWorksheet("Sales Summary", {
      views: [{ state: "frozen", ySplit: 5, xSplit: 5 }],
    });

    worksheet.mergeCells("A1:CU1");
    const titleText = worksheet.getCell("A1");
    titleText.font = {
      name: "Arial",
      family: 4,
      size: 16,
      underline: false,
      bold: true,
      color: { argb: "000000" },
    };

    titleText.value = tourSalesSummaryData[0].ShowName;

    worksheet.getCell("A3").value = "Tour";
    worksheet.getCell("A4").value = "Week";
    worksheet.getCell("B4").value = "Day";
    worksheet.getCell("C4").value = "Date";
    worksheet.getCell("D4").value = "Town";
    worksheet.getCell("E4").value = "Venue";
    worksheet.getColumn("E").width = 30;

    let firstRow = 5;
    let row = 5; // simulate cells results
    let rowCount = firstRow + row;

    let firstCol = "F"; // This will be used many times
    let lastCol = "M"; // THis will be dynamic
    let lastCol_1 = "N";
    let i = firstRow;

    let dateCol = firstCol;

    let lastDate = null;
    let ShowDate = null;
    let ResultCol = "F";
    for (let perf of tourSalesSummaryData) {
      /**
       * Check if we need the heading row for the Showdate
       */

      if (
        dateService.dateStringToSimple(lastDate) !=
          dateService.dateStringToSimple(perf.ShowDate) ||
        lastDate === null
      ) {
        ResultCol = "F";
        row = row + 1;

        ShowDate = new Date(perf.ShowDate);
        //Com A
        worksheet.getCell(`A${row}`).value = "Week " + perf.TourWeekNum;
        // ColB
        worksheet.getCell(`B${row}`).value = dateService.getWeekDay(ShowDate);
        // Colc
        worksheet.getCell(`C${row}`).value = dateService.dateStringToSimple(ShowDate);

        // COld
        worksheet.getCell(`D${row}`).value = perf.Town;
        // col E
        worksheet.getCell(`E${row}`).value = perf.VenueName;

        lastDate = ShowDate;
      }

      if (perf.GBPValue !== null) {
        worksheet.getCell(`${ResultCol}${row}`).value = "£" + perf.GBPValue;
      } else {
        worksheet.getCell(`${ResultCol}${row}`).value = "£" + 0.0;
        worksheet.getCell(`${ResultCol}${row}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff0000" },
        };
      }

      ResultCol = nextColumn(ResultCol);
    }
    ResultCol = "F";
    let LastResultCol = "F";

    /**
     * Sum Rows
     *
     */

    rowCount = row;
    worksheet.getCell(`E${rowCount + 1}`).value = "Total Sales £ ";
    worksheet.getCell(`E${rowCount + 3}`).value = "Grand Total £ ";

    worksheet.getCell(`E${rowCount + 5}`).value = "Weekly Increase £ ";
    worksheet.getCell(`E${rowCount + 6}`).value = "Weekly Increase % ";

    for (let week of weeks) {
      worksheet.getCell(`${dateCol}3`).value = week.WeekName;
      worksheet.getCell(`${dateCol}4`).value = dateService.dateStringToSimple(
        week.WeekDate
      );
      lastCol = dateCol;

      worksheet.getCell(`${dateCol}${rowCount + 2}`).value = {
        formula: `sum(${dateCol}${firstRow}:${dateCol}${rowCount})`,
      };
      worksheet.getCell(`${dateCol}${rowCount + 4}`).value = {
        formula: `sum(${dateCol}${firstRow}:${lastCol_1}${rowCount})`,
      };
      LastResultCol = dateCol;

      dateCol = nextColumn(dateCol);
    }

    // Change Col
    worksheet.getCell(`${dateCol}${3}`).value = "Change Vs";
    worksheet.getCell(`${dateCol}${4}`).value = "Last Week";

    while (i < rowCount) {
      worksheet.getCell(`${dateCol}${i + 1}`).value = {
        formula: `${LastResultCol}${i + 1}:${lastCol}${i + 1}`,
      };
      i++;
    }

    worksheet.getCell(`${dateCol}${rowCount + 2}`).value = {
      formula: `sum(${dateCol}${firstRow}:${lastCol_1}${rowCount})`,
    };

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Sales-Summary-${new Date().toISOString()}.xlsx`
      );
    });
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    buildReport()
      .then(() => {
        handleServerResponse(true, "File Download completed.");
        //handleClose()
        setShowModal(false);
        setInputs({
          Tour: null,
          TourWeek: null,
          numberOfWeeks: null,
          order: null,
          tourStartDate: null,
          tourEndDate: null,
        });
        setTourWeeks([]);
      })
      .catch((error) => {
        alert("No Report could be Data: " + error);
        console.log(error);
        setInputs({
          Tour: null,
          TourWeek: null,
          numberOfWeeks: null,
          order: null,
          tourStartDate: null,
          tourEndDate: null,
        });
        setTourWeeks([]);
        handleServerResponse(false, "Error");
      });
  }

  async function handleOnChange(e) {
    e.persist();
    if (e.target.name == "Tour") {
      setTourWeeks([]);
      fetch(`/api/reports/tourWeek/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => {
          setTourStartDate(data[0].TourStartDate);
          setTourEndDate(data[0].TourEndDate);
          //Make sure tour weeks are empty
          setTourWeeks([]);
          // Set tour weeks with data
          setTourWeeks(data);
        });
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    inputs.tourStartDate = tourStartDate; //data[0].Tour.TourStartDate
    inputs.tourEndDate = tourEndDate;
  }

  return (
    <>
      <IconWithText
        icon={faChartPie}
        text={"Sales Summary"}
        onClick={() => setShowModal(true)}
      />

      {/* <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Sales Summary
            </button> */}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/*content*/}
              <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Sales Summary</h3>
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
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-lg font-medium">
                      Tour
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.Tour}
                      id="Tour"
                      name="Tour"
                      onChange={handleOnChange}
                    >
                      <option>Select a Tour</option>
                      {activeTours.map((tour) => (
                        <option key={tour.TourId} value={`${tour.TourId}`}>
                          {tour.Show.Code}/{tour.Code} | {tour.Show.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <input
                      type={"hidden"}
                      name={"tourStartDate"}
                      id={"tourStartDate"}
                      value={inputs.tourStartDate}
                    />
                    <input
                      type={"hidden"}
                      name={"tourEndDate"}
                      id={"tourEndDate"}
                      value={inputs.tourEndDate}
                    />
                    {inputs.tourStartDate != null ? (
                      <p className="text-lg">
                        Tour Dates{" "}
                        {dateService.dateStringToSimple(inputs.tourStartDate)} to{" "}
                        {dateService.dateStringToSimple(inputs.tourEndDate)}
                      </p>
                    ) : (
                      <p className="text-lg">
                        Select a Tour to populate report filters
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Tour Week
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.TourWeek}
                      id="TourWeek"
                      name="TourWeek"
                      onChange={handleOnChange}
                    >
                      {tourWeeks.map((week) => (
                        <option
                          key={week.MondayDate}
                          value={`${week.MondayDate}`}
                        >
                          {week.Description}{" "}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Number of weeks
                    </label>
                    <select
                      className="block w-full min-w-0 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.numberOfWeeks}
                      id="numberOfWeeks"
                      name="numberOfWeeks"
                      onChange={handleOnChange}
                    >
                      <option>Select a timespan</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                    </select>
                  </div>

                  <div className="flex flex-col my-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Order
                    </label>
                    <select
                      className="block w-full min-w-0 flex-1  shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.order}
                      id="order"
                      name="Order"
                      onChange={handleOnChange}
                    >
                      <option value={"date"}>Show Date</option>
                      <option value={"sales"}>
                        Show Sales (Low to Highest)
                      </option>
                      <option value={"change"}>
                        Change (Lowest to highest)
                      </option>
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
                      type="submit"
                    >
                      {" "}
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
