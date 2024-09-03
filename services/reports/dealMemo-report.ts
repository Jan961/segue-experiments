import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function exportDealMemoToPDF(): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size in points (72 DPI)

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.9, 0.9, 0.9);

  const titleFontSize = 6.3;
  const subtitleFontSize = 4.9;
  const textFontSize = 4.2;

  const marginLeft = 50;
  let currentY = 800;

  // Header - Venue to Complete Highlighted Cells
  page.drawRectangle({
    x: marginLeft,
    y: currentY - 21,
    width: 495,
    height: 21,
    color: lightGray,
  });

  page.drawText('VENUE TO COMPLETE HIGHLIGHTED CELLS', {
    x: marginLeft + 10,
    y: currentY - 15,
    size: subtitleFontSize,
    font: boldFont,
    color: darkGray,
  });

  currentY -= 42;

  // Title
  page.drawText('AGREED DEAL MEMO DATED:', {
    x: marginLeft,
    y: currentY,
    size: titleFontSize,
    font: boldFont,
    color: black,
  });

  currentY -= 21;

  // Contact Information Section
  page.drawText('CONTACT', {
    x: marginLeft,
    y: currentY,
    size: subtitleFontSize,
    font: boldFont,
    color: black,
  });

  currentY -= 15;

  page.drawText('NLP Ltd. CONTACT', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: boldFont,
    color: black,
  });

  page.drawText('Derrick Gask Telephone:', {
    x: marginLeft + 105,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  page.drawText('Mob: 07971247443', {
    x: marginLeft + 245,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('Head Office:', {
    x: marginLeft + 105,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  page.drawText('01584819005', {
    x: marginLeft + 245,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('London Office:', {
    x: marginLeft + 105,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  page.drawText('02072402116', {
    x: marginLeft + 245,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('Email: dgask@cdm-ltd.com', {
    x: marginLeft + 105,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 30;

  // Performance Section
  page.drawText('PERFORMANCE', {
    x: marginLeft,
    y: currentY,
    size: subtitleFontSize,
    font: boldFont,
    color: black,
  });

  currentY -= 15;

  page.drawText('DATE: Fri 6 & Sat 7 Dec', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('PERFORMANCE TITLE: Dear Santa', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('SCHEDULE', {
    x: marginLeft,
    y: currentY,
    size: subtitleFontSize,
    font: boldFont,
    color: black,
  });

  currentY -= 15;

  page.drawText('Get In: 6th Dec 2019 @ 8.00am', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('Doors: 25 mins before curtain up', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 21;

  // Deal Section
  page.drawRectangle({
    x: marginLeft,
    y: currentY - 10.5,
    width: 495,
    height: 10.5,
    color: lightGray,
  });

  page.drawText('DEAL', {
    x: marginLeft + 10,
    y: currentY - 7,
    size: subtitleFontSize,
    font: boldFont,
    color: darkGray,
  });

  currentY -= 21;

  page.drawText('ROYALTY: Off the top 12% off the top', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('GUARANTEE: N/A TO BE PAID BY: NA', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('SPLIT: NLP Ltd 80.0% Venue: 20.0%', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 21;

  // Continue with similar structure for other sections...
  // Example:
  page.drawText('VENUE RENTAL: N/A', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText('STAFFING CONTRA: N/A', {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 12;

  page.drawText("AGREED CONTRA'S: £TBC Marketing", {
    x: marginLeft + 10,
    y: currentY,
    size: textFontSize,
    font: helveticaFont,
    color: black,
  });

  currentY -= 30;

  // Continue to build out other sections according to the provided PDF structure...

  // Save the document
  const pdfBytes = await pdfDoc.save();

  // Trigger download of the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'DealMemo.pdf';
  link.click();
}
