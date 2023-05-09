import { PrismaClient } from '@prisma/client'
import tempfile from "tempfile";
const prisma = new PrismaClient()


import Excel from "exceljs/dist/es5/exceljs.browser";

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {

    try {
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');

        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'D.O.B.', key: 'DOB', width: 10 }
        ];
        worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
        worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

        var tempFilePath = tempfile('.xlsx');
        workbook.xlsx.writeFile(tempFilePath, ".").then(function() {
            console.log('file is written');
            res.sendFile(tempFilePath, function(err){
                console.log('---------- error downloading file: ' + err);
            });
        });
    } catch(err) {
        console.log('OOOOOOO this is the error: ' + err);
    }



}