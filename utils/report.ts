import libre from 'libreoffice-convert';
import util from 'util';

export const convertToPDF = async (workbook) => {
  const excelbuffer = await workbook.xlsx.writeBuffer();
  const converter = util.promisify(libre.convert);
  const pdfBuffer = await converter(excelbuffer, '.pdf', undefined);
  return pdfBuffer;
};
