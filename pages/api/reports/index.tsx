

export default async function handle(req, res) {

    const excel = require("exceljs");

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");
    /**
    worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "Title", key: "title", width: 25 },
        { header: "Description", key: "description", width: 25 },
        { header: "Published", key: "published", width: 10 },
    ];
    **/
// Add Array Rows
    //worksheet.addRow({"ss","ss", "dfsdsdhjfsdkjfdhjfd","true"});

// res is a Stream object
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });

}