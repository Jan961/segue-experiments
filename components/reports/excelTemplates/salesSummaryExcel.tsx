import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from 'file-saver'

// https://medium.com/@aalam-info-solutions-llp/excel-import-in-next-js-50359f3d7f66
const SalesSummaryExcel = () =>  {

    let excelExport = DataGrid => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("ExcelJS sheet");
        var columns = DataGrid.getVisibleColumns();

        worksheet.mergeCells("A2:I2");

        const customCell = worksheet.getCell("A2");
        customCell.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 20,
            underline: true,
            bold: true
        };
        customCell.fill = "#494994"

        customCell.value = "Custom header here";

        var headerRow = worksheet.addRow();
        worksheet.getRow(4).font = {bold: true};

        for (let i = 0; i < columns.length; i++) {
            let currentColumnWidth = DataGrid.option().columns[i].width;
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = columns[i].caption;
        }

        // @ts-ignore
        if (this.state.excelFilterEnabled === true) {
            worksheet.autoFilter = {
                from: {
                    row: 3,
                    column: 1
                },
                to: {
                    row: 3,
                    column: columns.length
                }
            };
        }

        // eslint-disable-next-line no-unused-expressions
        // @ts-ignore
        this.state.excelFilterEnabled === true
            ? (worksheet.views = [{state: "frozen", ySplit: 3}])
            : undefined;

        worksheet.properties.outlineProperties = {
            summaryBelow: false,
            summaryRight: false
        };

        DataGrid.getController("data")
            .loadAll()
            .then(function (allItems) {
                for (let i = 0; i < allItems.length; i++) {
                    var dataRow = worksheet.addRow();
                    if (allItems[i].rowType === "data") {
                        dataRow.outlineLevel = 1;
                    }
                    for (let j = 0; j < allItems[i].values.length; j++) {
                        let cell = dataRow.getCell(j + 1);
                        cell.value = allItems[i].values[j];
                    }
                }

                const rowCount = worksheet.rowCount;
                worksheet.mergeCells(`A${rowCount}:I${rowCount + 1}`);
                worksheet.getRow(1).font = {bold: true};
                worksheet.getCell(`A${rowCount}`).font = {
                    name: "Comic Sans MS",
                    family: 4,
                    size: 20,
                    underline: true,
                    bold: true
                };

                worksheet.getCell(`A${rowCount}`).value = "Custom Footer here";

                ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(
                        new Blob([buffer], {type: "application/octet-stream"}),
                        `${DataGrid.option().export.fileName}.xlsx`
                    );
                });
            });
    };



    return (
        <button onClick={excelExport}>Save</button>
    );

}

export default SalesSummaryExcel
