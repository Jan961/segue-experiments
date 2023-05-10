import React, {useEffect, useState} from "react";
import IconWithText from "../IconWithText";
import {faChartPie} from "@fortawesome/free-solid-svg-icons";
import {userService} from "../../../services/user.service";
import {dateService} from "../../../services/dateService";
import moment from "moment";
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";

export default function SalesSummarySimple(){
    const [showModal, setShowModal] = React.useState(false);
    const [activeTours, setActiveTours] = useState([]);
    const [tourWeeks, setTourWeeks] = useState([]);
    const [tourStartDate, setTourStartDate] = useState(null);
    const [tourEndDate, setTourEndDate] = useState(null);

    const [results, setResults] = useState([]);
    const [tourSalesSummaryData, setTourSalesSummaryData] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [showName, setShowName] = useState(null);

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
                });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            alert(inputs.Tour)
            fetch(`/api/reports/tourWeek/${inputs.Tour}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setTourStartDate(data[0].TourStartDate); // This is shared with all weeks in the tour
                    setTourEndDate(data[0].TourEndDate);
                    setShowName(data[0].Name)
                    //Make sure tour weeks are empty
                    setTourWeeks([]);
                    // Set tour weeks with data
                    setTourWeeks(data);
                });

        })();
    }, [inputs.Tour]);

    async function createExcel() {
        const ExcelJSWorkbook = new ExcelJS.Workbook();
        const worksheet = ExcelJSWorkbook.addWorksheet("Sales Summary", {
            views: [{state: "frozen", ySplit: 5, xSplit: 5}],
        });

        // @ts-ignore
        worksheet.getCell(1, 1).value = tour.Show.Name + "(" + tour.Show.Code + tour.Code + ")"
        // Static Column Hedings
        let CapacityMode = false
        let HeadingsFirstRowNum = 3
        let ColNum = 0

        ColNum = ColNum + 1;
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "Tour: "
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum, ColNum).value = "Tour"
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Week"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Day"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Date"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Town"
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Venue"
        //worksheet.getColumn.name = ColNum

        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Currency"
        //CurrencyColNum = ColNum
        ColNum = ColNum + 1
        worksheet.getCell(HeadingsFirstRowNum + 1, ColNum).value = "Symbol"
        //SymbolColNum = ColNum

        let FirstDataColNum = ColNum + 1
        let LastDataColNum = FirstDataColNum

        for (let week of weeks) {
            worksheet.getCell(HeadingsFirstRowNum, LastDataColNum).value = week.WeekName
            worksheet.getCell(HeadingsFirstRowNum + 1, LastDataColNum).value = week.WeekDate
            // Note the week num for use later
            let ColWeek = LastDataColNum + 1
            //ColWeek(LastDataColNum) = Weeks!WeekCode
            LastDataColNum = LastDataColNum + 1
        }
        LastDataColNum = LastDataColNum - 1

        //Change vs last week' column heading
        worksheet.getCell(HeadingsFirstRowNum, LastDataColNum + 1).value = "Change vs"
        worksheet.getCell(HeadingsFirstRowNum + 1, LastDataColNum + 1).value = "Last Week"

        if (CapacityMode) {
            worksheet.getCell(HeadingsFirstRowNum, LastDataColNum + 2).value = "Run Seats"

            worksheet.getCell(HeadingsFirstRowNum + 1, LastDataColNum + 2).value = "Sold"
            worksheet.getCell(HeadingsFirstRowNum, LastDataColNum + 3).value = "Run Seats"

            worksheet.getCell(HeadingsFirstRowNum + 1, LastDataColNum + 3).value = "Capacity"
            worksheet.getCell(HeadingsFirstRowNum, LastDataColNum + 4).value = "Run Sales"

            worksheet.getCell(HeadingsFirstRowNum + 1, LastDataColNum + 4).value = "vs Capacity"
        }

        // Base Data

        let FirstDataRowNum
        let LastDataRowNum
        let ShowDate
        let RowNum

        let CurrentTourWeekNum
        let DoWeeklyTotalRows

        FirstDataRowNum = HeadingsFirstRowNum + 3
        RowNum = FirstDataRowNum
        /**
         for (record of data){

            if (record.ShoweDate != ShowDate){
                if(IsDate(ShowDate){
                    RowNum = RowNum + 1
                    ShowDate = data.ShowDate
                }

                ColNum = 0

                ColNum = ColNum + 1
                worksheet.getCell(RowNum, ColNum).value = "Week " + Data.TourWeekNum
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, ColNum).value  = GetWeekdayName(Data.ShowDate)
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, ColNum).value  = Data.ShowDate
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, ColNum).value  = Data.Town
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, NameColNum).value  = Data.VenueName
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, CurrencyColNum).value  = Data.VenueCurrency
                ColNum = ColNum + 1
                worksheet.getCell(RowNum, SymbolColNum).value  = Data.Symbol

                if(CapacityMode){
                   if(Data.RunSeatsSold !== null){
                        worksheet.getCell(RowNum, LastDataColNum + 2).value = Data.RunSeatsSold //Val(Data!RunSeatsSold) TODO find what this is
                        if (Data.TotalSeats > 0){
                            worksheet.getCell(RowNum, LastDataColNum + 4).value = Data.RunSeatsSold / Data.TotalSeats //Val(Data!RunSeatsSold / Data!TotalSeats)
                        }else {
                            worksheet.getCell(RowNum, LastDataColNum + 4).value = 0
                        }
                        worksheet.getCell(RowNum, LastDataColNum + 3).value = Data.TotalSeats
                    }
                    ColNum = FirstDataColNum

                    }
                if(data.value != null){
                worksheet.getCell(RowNum, ColNum).value = parseInt(Data.Value)  // ' Val as MySQL turns this into a text field :-(
                }

                if (data.BookingStatus == "X"){
                    worksheet.getCell(RowNum, ColNum).Font.Color = LightGreyCellBorderColour
                } else if (!Data.IsCopy){
                    worksheet.getCell(RowNum, ColNum).Interior.Color = PurpleBackgroundColour
                    worksheet.getCell(RowNum, ColNum).Font.Color = vbWhite
                    worksheet.getCell(RowNum, ColNum).Borders.Color = LightGreyCellBorderColour
                } else if(Data.FinalFigures){
                    worksheet.getCell(RowNum, ColNum).Interior.Color = PaleBlueBackgroundColour
                    worksheet.getCell(RowNum, ColNum).Borders.Color = LightGreyCellBorderColour
                } else if(Data.BrochureReleased){
                    worksheet.getCell(RowNum, ColNum).Interior.Color = YellowBackgroundColour
                    worksheet.getCell(RowNum, ColNum).Borders.Color = LightGreyCellBorderColour
                } else if(Data.SingleSeats) {
                    worksheet.getCell(RowNum, ColNum).Interior.Color = GreenBackgroundColour
                    worksheet.getCell(RowNum, ColNum).Borders.Color = LightGreyCellBorderColour
                } else if(Data.SalesFiguresDate <= Data.NotOnSaleDate){
                    /**

                    with( worksheet.Range(worksheet.getCell(RowNum, FirstDataColNum),
                        worksheet.getCell(RowNum, ColNum))).Font.Color = YellowForeGroundColour
                            .Interior.Color = RedBackgroundColour
                            .Borders.Color = LightGreyCellBorderColour
                    }
         */
        /**
         //todo: debug this
         }

         if(Data.BookingStatus = "X"){
                    worksheet.getCell(RowNum, NameColNum).Interior.Color = vbBlack
                    worksheet.getCell(RowNum, NameColNum).Font.Color = vbWhite
                } else if (Data.BookingStatus = "S"){
                    worksheet.getCell(RowNum, NameColNum).Interior.Color = LilacBackgroundColour
                    worksheet.getCell(RowNum, NameColNum).Font.Color = vbWhite
                }

         ColNum = ColNum + 1

         if (WithWeeklyTotals)
         {
                    CurrentTourWeekNum = Data.TourWeekNum
                }

         }
         // } // End data

         if(WithWeeklyTotals){


            if(Data.EOF) {
                DoWeeklyTotalRows = True
            } else if (CurrentTourWeekNum != (Data.TourWeekNum){
                DoWeeklyTotalRows = True
            }

            if(DoWeeklyTotalRows){

                let done = false
                let firstRow = true

                if(!Done){
                    Done = CurrencyWeekTotals.TourWeekNum != CurrentTourWeekNum
                }

                while (!done){
                    RowNum = RowNum + 1

                    if(firstRow){
                        worksheet.getCell(RowNum, NameColNum).value = "Tour Week " + CurrencyWeekTotals.TourWeekNum
                        worksheet.getCell(RowNum, NameColNum).VerticalAlignment = "xlVAlignTop"
                        firstRow = false
                    } else{
                        worksheet.Range(worksheet.getCell(RowNum - 1, 1), WorkSheet.Cells(RowNum, NameColNum - 1)).Merge
                        worksheet.getCell.Range(worksheet.getCellCells(RowNum - 1, NameColNum), worksheet.getCell(RowNum, NameColNum)).Merge
                    }

                    worksheet.Range(WorkSheet.Cells(RowNum, 1), worksheet.Cells(RowNum, NameColNum - 1)).Merge
                    worksheet.getCell(RowNum, SymbolColNum).value = CurrencyWeekTotals.Symbol

                    for(let colNum = FirstDataColNum; colNum <= LastDataColNum; colNum++)
                    {
                        worksheet.getCell(RowNum, ColNum).value = CurrencyWeekTotals.Total
                        if(!CurrencyWeekTotals.EOF){
                            CurrencyWeekTotals.MoveNext
                        }
                    }
                    Done = CurrencyWeekTotals.EOF
                    if (Done) {
                        CurrencyWeekTotals.MovePrevious //Go back to final record so we can access its values below....
                    } else {
                        Done = CurrencyWeekTotals.TourWeekNum < > CurrentTourWeekNum // Done when run out of weekly totals for this tour week
                    }

                    if(CapacityMode) {
                        worksheet.getCell(RowNum, LastDataColNum + 2).value = Val(CurrencyWeekTotals.TotalRunSeatsSold)
                        worksheet.getCell(RowNum, LastDataColNum + 3).value  = Val(CurrencyWeekTotals.TotalTotalSeats)
                        if(parseInt(CurrencyWeekTotals.TotalTotalSeats > 0){

                            worksheet.getCell(RowNum, LastDataColNum + 4).value  = Val(CurrencyWeekTotals.TotalRunSeatsSold / CurrencyWeekTotals.TotalTotalSeats)
                        }

                    // Change
                        worksheet.getCell(RowNum, LastDataColNum + 1).value  = parseFloat(WorkSheet.Cells(RowNum, LastDataColNum + 1)) - parseFloat(WorkSheet.Cells(RowNum, LastDataColNum))

                    // Formatting
                        worksheet.Range(worksheet.getCell(RowNum, NameColNum), worksheet.getCell(RowNum, LastDataColNum + 1)).Font.Bold = true
                }
            }
                DoWeeklyTotalRows = false

            }


            let VenueCurrency
            let LastCurrencyTotalRowNum
            let FirstCurrencyTotalRowNum

            FirstCurrencyTotalRowNum = LastDataRowNum + 2
            LastCurrencyTotalRowNum = FirstCurrencyTotalRowNum
            RowNum = FirstCurrencyTotalRowNum

            for(let CurrencyGrandTotal in CurrencyGrandTotals){
                if(currencyGrandTotal.VenueCurrency != VenueCurrency){
                    RowNum = RowNum + 1
                    LastCurrencyTotalRowNum = LastCurrencyTotalRowNum + 1
                }

                VenueCurrency = CurrencyGrandTotals.VenueCurrency
                worksheet.getCell(RowNum, NameColNum).value = "Total Sales " + CurrencyGrandTotals.Symbol
                if(CurrencyGrandTotal.VenueCurrency <> "GBP"){
                    worksheet.getCell(RowNum, NameColNum).value = worksheet.getCell(RowNum, NameColNum) + "  (Note: " + CurrencyGrandTotals.Symbol + "1 = £" + Format(CurrencyGrandTotals.ConversionRate, "0.00##") + ")"
                }

                worksheet.getCell(RowNum, CurrencyColNum) = CurrencyGrandTotal.VenueCurrency
                worksheet.getCell(RowNum, SymbolColNum) = CurrencyGrandTotal.Symbol

                if(CapacityMode){
                    worksheet.getCell(RowNum, LastDataColNum + 2) = parseFloat(CurrencyGrandTotal.TotalRunSeatsSold)
                    worksheet.getCell(RowNum, LastDataColNum + 3) = parseFloat(CurrencyGrandTotals.TotalTotalSeats)

                    if(parseFloat(CurrencyGrandTotals!TotalTotalSeats) > 0){
                        worksheet.getCell(RowNum, LastDataColNum + 4) = parseFloat(CurrencyGrandTotal.TotalRunSeatsSold / CurrencyGrandTotal.TotalTotalSeats)
                }
                    ColNum = FirstDataColNum
            }
                worksheet.getCell(RowNum, ColNum) = CurrencyGrandTotals.Total
                ColNum = ColNum + 1
        }

            let TotalsRowNum

            TotalsRowNum = LastCurrencyTotalRowNum + 2

            RowNum = TotalsRowNum
            ColNum = FirstDataColNum

            worksheet.getCell(RowNum, NameColNum).value = "Grand Total £"
            worksheet.getCell(RowNum, CurrencyColNum).value = "GBP"
            worksheet.getCell(RowNum, SymbolColNum).value = "£"

            //GrandTotals.MoveFirst
            //GrandTotals.MoveLast
            //GrandTotals.MoveFirst

            for(GrandTotal of GrandTotals){
                worksheet.getCell(RowNum, ColNum).value = GrandTotal.GBPTotal
                if(CapacityMode){
                    worksheet.getCell(RowNum, LastDataColNum + 2).value = Val(GrandTotal.TotalRunSeatsSold)
                    worksheet.getCell(RowNum, LastDataColNum + 3).value = Val(GrandTotal.TotalTotalSeats)
                    if (parseInt(GrandTotal.TotalTotalSeats) > 0){
                        worksheet.getCell(RowNum, LastDataColNum + 4).value = parseFloat(GrandTotal.TotalRunSeatsSold / GrandTotal.TotalTotalSeats)
                    }
                }
                ColNum = ColNum + 1
            }

            for(RowNum = FirstDataRowNum; RowNum <= LastDataRowNum; RowNum++){
                worksheet.getCell(RowNum, LastDataColNum + 1).value = worksheet(RowNum, LastDataColNum) - worksheet.Cells(RowNum, LastDataColNum - 1)
            }
            for( RowNum = FirstCurrencyTotalRowNum; RowNum <= LastCurrencyTotalRowNum; RowNum ++){
                worksheet.getCell(RowNum, LastDataColNum + 1).value = worksheet.getCell(RowNum, LastDataColNum) - worksheet.getCell(RowNum, LastDataColNum - 1)
            }
            worksheet.getCell(TotalsRowNum, LastDataColNum + 1).value = worksheet.getCell(TotalsRowNum, LastDataColNum) - worksheet.getCell(TotalsRowNum, LastDataColNum - 1)

            let PreviousTourStatsRowNum

            if(PreviousYear > 0) {
                PreviousTourStatsRowNum = TotalsChangeRowNum + 3
                worksheet.getCell(PreviousTourStatsRowNum, NameColNum).value = Format(PreviousYear, "0000") + " Sales Value £" //todoformar to year date object
                worksheet.getCell(PreviousTourStatsRowNum, CurrencyColNum).value  = "GBP"
                worksheet.getCell(PreviousTourStatsRowNum, SymbolColNum).value  = "£"

                worksheet.getCell(PreviousTourStatsRowNum + 1, NameColNum).value = Format(CurrentYear, "0000") & " vs " + Format(PreviousYear, "0000") + " Change %"
                worksheet.getCell(PreviousTourStatsRowNum + 1, CurrencyColNum).value  = "GBP"
                worksheet.getCell(PreviousTourStatsRowNum + 1, SymbolColNum) .value = "£"

                worksheet.getCell(PreviousTourStatsRowNum + 2, NameColNum).value  = Format(CurrentYear, "0000") + " vs " & Format(PreviousYear, "0000") + " Proportional Change %"
                worksheet.getCell(PreviousTourStatsRowNum + 2, CurrencyColNum).value  = "GBP"
                worksheet.getCell(PreviousTourStatsRowNum + 2, SymbolColNum).value  = "£"

                for(ColNum = FirstDataColNum; ColNum <=  LastDataColNum; ColNum++){
                    /**


                     If ColWeek(ColNum) <> "" Then
                     PreviousTourStats.FindFirst "WeekCode = '" & ColWeek(ColNum) & "'"
                     If Not PreviousTourStats.NoMatch Then
                     WorkSheet.Cells(PreviousTourStatsRowNum + 0, ColNum) = Val(PreviousTourStats!Sales)
                     If (PreviousTourStats!Sales > 0) And (WorkSheet.Cells(TotalsRowNum, ColNum) > 0) Then
                     WorkSheet.Cells(PreviousTourStatsRowNum + 1, ColNum) = (((100 / PreviousTourStats!Sales) * WorkSheet.Cells(TotalsRowNum, ColNum)) - 100) / 100
                     If AdjustmentFactor <> 0 Then
                     WorkSheet.Cells(PreviousTourStatsRowNum + 2, ColNum) = (((100 / (PreviousTourStats!Sales * AdjustmentFactor)) * WorkSheet.Cells(TotalsRowNum, ColNum)) - 100) / 100
                     End If
                     End If
                     End If
                     End If

         */
        /**
         }

         }

         let SortColumnRange
         let DataRange

         if(CapacityMode){
                let DataRange = worksheet.Range(worksheet.getCell(FirstDataRowNum, 1), worksheet.getCell(LastDataRowNum, LastDataColNum + 4))
                let SortColumnRange = worksheet.Range(worksheet.getCell(FirstDataRowNum, LastDataColNum + 4), worksheet.getCell(LastDataRowNum, LastDataColNum + 4))
                DataRange.Sort(SortColumnRange, "xlAscending")
            } else(SortByOption != "Show Date" && !WithWeeklyTotals)  {
                /*

                Set DataRange = WorkSheet.Range(WorkSheet.Cells(FirstDataRowNum, 1), WorkSheet.Cells(LastDataRowNum, LastDataColNum + 1))
                Select Case SortByOption
                Case "Sales (Lowest to Highest)": Set SortColumnRange = WorkSheet.Range(WorkSheet.Cells(FirstDataRowNum, LastDataColNum), WorkSheet.Cells(LastDataRowNum, LastDataColNum))
                Case "Change (Lowest to Highest)": Set SortColumnRange = WorkSheet.Range(WorkSheet.Cells(FirstDataRowNum, LastDataColNum + 1), WorkSheet.Cells(LastDataRowNum, LastDataColNum + 1))
                End Select


                DataRange.Sort(SortColumnRange, "xlAscending")
            }

         LastDataRowNum = RowNum
         }
         }
         */
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], {type: "application/octet-stream"}),
                `Sales-Summary-${new Date().toISOString()}.xlsx`
            );
        });

    }

    function weeksBefore(date, weeks) {
        return dateService.getDateDaysAgo(date, weeks);
    }

    function formatDate(date) {
        return dateService.toSql(date);
    }

    function formatShortYearDate(dateString){
        var dateMomentObject = moment(dateString, "DD/MM/YY"); // 1st argument - string, 2nd argument - format
        let day = dateService.toISO(dateMomentObject).substring(0,10)
        return day //new Date( dateMomentObject.toDate());
    }

    function nextColumn(column) {
        return String.fromCharCode(column.charCodeAt(0) + 1);
    }

    function buildReport(){
        let EndDate = formatShortYearDate(inputs.TourWeek);
        let StartDate =formatShortYearDate( weeksBefore(EndDate, inputs.numberOfWeeks)); //weeksBefore(EndDate, inputs.numberOfWeeks)
        let TourStartDate = formatDate(tourStartDate);
        let TourEndDate = formatDate(tourEndDate);

        fetch(`/api/reports/call/salesSummary/${inputs.Tour}/${StartDate}/${EndDate}/${TourStartDate}/${TourEndDate}/data`)
            .then((res) => res.json())
            .then((data) => {
                setTourSalesSummaryData(data);
                fetch(`/api/reports/call/salesSummary/${inputs.Tour}/${StartDate}/${EndDate}/${TourStartDate}/${TourEndDate}/weeks`)
                    .then((res) => res.json())
                    .then((data) => {
                        setWeeks(data);
                    });
            });


    }

    function handleOnSubmit(e){
        e.preventDefault();
        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

        alert(JSON.stringify(inputs))
        buildReport()


    };


        function handleOnChange(e) {
        e.persist();
        alert("e")
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };
    return(
        <>
            <IconWithText
                icon={faChartPie}
                text={"Sales Summary"}
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
                                            Sales Summary Simple
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

                                    <div className="mt-6">

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

                                    <div className="mt-6">
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
)
}