import tempfile from 'tempfile';
import Excel from 'exceljs/dist/es5/exceljs.browser';

export default async function handle(req, res) {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10 },
    ];
    worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

    const tempFilePath = tempfile('.xlsx');
    workbook.xlsx.writeFile(tempFilePath, '.').then(function () {
      console.log('file is written');
      res.sendFile(tempFilePath, function (err) {
        console.log('---------- error downloading file: ' + err);
      });
    });
  } catch (err) {
    console.log('OOOOOOO this is the error: ' + err);
  }
}
