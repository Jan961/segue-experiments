
import { Prisma } from '@prisma/client'
import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'
import moment from 'moment'
import { COLOR_HEXCODE } from 'services/salesSummaryService'

type TPromoter = {
  TourId : number,
  FullTourCode : string,
  VenueCode : string,
  VenueName : string,
  BookingId : number,
  PerformanceDate : string,
  PerformanceTime : string,
  AvailableCompSeats : number | null,
  AvailableCompNotes : string | null,
  CompAllocationSeats : number | null,
  CompAllocationTicketHolderName : string | null,
  CompAllocationSeatsAllocated : number | null,
  CompAllocationTicketHolderEmail : string | null,
  CompAllocationComments : string | null,
  CompAllocationRequestedBy : string | null,
  CompAllocationArrangedBy : string | null,
  CompAllocationVenueConfirmationNotes : string | null
}

const alignColumnTextRight = ({ worksheet, colAsChar }: {worksheet: any, colAsChar: string}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' }
  })
}

const alignCellTextCenter = ({ worksheet, colAsChar }: {worksheet: any, colAsChar: string}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'center' }
  })
}

const makeRowTextBoldAndAllignLeft = ({ worksheet, row, numberOfColumns }: {worksheet: any, row: number, numberOfColumns: number}) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col)
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } }
    cell.alignment = { horizontal: 'left' }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.BLUE }
    }
    // cell.border = {
    //   top: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   left: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   bottom: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   right: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } }
    // }
  }
}

// TODO - Issue with Performance Time
const handler = async (req, res) => {
  const { tourCode, fromDate, toDate, venue, tourId } = JSON.parse(req.body) || {}

  const workbook = new ExcelJS.Workbook()

  const conditions: Prisma.Sql[] = []
  if (tourId) {
    conditions.push(Prisma.sql`TourId = ${tourId}`)
  }
  if (venue) {
    conditions.push(Prisma.sql`VenueCode = ${venue}`)
  }
  if (fromDate && toDate) {
    conditions.push(Prisma.sql`PerformanceDate BETWEEN ${fromDate} AND ${toDate}`)
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
  const data: TPromoter[] = await prisma.$queryRaw`select * FROM PromoterHoldsView ${where} order by PerformanceDate;`

  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
  })

  worksheet.addRow((['PROMOTER HOLDS']))
  const date = new Date()
  worksheet.addRow(([`Exported: ${moment(date).format('DD/MM/YY')} at ${moment(date).format('hh:mm')}`]))
  worksheet.addRow((['TOUR', 'VENUE', '', 'SHOW', '', 'AVAILABLE', '', 'ALLOCATED', '']))
  worksheet.addRow((['CODE', 'CODE', 'NAME', 'DATE', 'TIME', 'SEATS', 'NOTES', 'SEATS', 'NAME', 'SEAT NUMBERS', 'EMAIL', 'NOTES', 'REQUESTED BY', 'ARRANGED BY', 'VENUE CONFIRMATION']))

  data.forEach(x => {
    const tourCode = x.FullTourCode || ''
    const venueCode = x.VenueCode || ''
    const venueName = x.VenueName || ''
    const showDate = x.PerformanceDate ? moment(x.PerformanceDate).format('DD/MM/YY') : ''
    const showTime = x.PerformanceTime || ''
    const availableSeats = x.AvailableCompSeats || ''
    const availableNotes = x.AvailableCompNotes || ''
    const allocatedSeats = x.CompAllocationSeats || ''
    const allocatedName = x.CompAllocationTicketHolderName || ''
    const seatNumber = x.CompAllocationSeatsAllocated || ''
    const email = x.CompAllocationTicketHolderEmail || ''
    const notes = x.CompAllocationComments || ''
    const requestedBy = x.CompAllocationRequestedBy || ''
    const arrangedBy = x.CompAllocationArrangedBy || ''
    const venueConfirmation = x.CompAllocationVenueConfirmationNotes || ''

    console.log(x)
    console.log('showTime ->>>>>>>>>>>>>>>>>', showTime)
    worksheet.addRow([tourCode, venueCode, venueName, showDate, showTime, availableSeats, availableNotes, allocatedSeats, allocatedName, seatNumber, email, notes, requestedBy, arrangedBy, venueConfirmation])
  })

  const numberOfColumns = worksheet.columnCount

  worksheet.mergeCells('A1:E1')
  worksheet.mergeCells('A2:C2')
  worksheet.mergeCells('B3:C3')
  worksheet.mergeCells('D3:E3')
  worksheet.mergeCells('F3:G3')
  worksheet.mergeCells('H3:I3')

  for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    worksheet.getColumn(char).width = 15
  }
  alignColumnTextRight({ worksheet, colAsChar: 'D' })
  alignColumnTextRight({ worksheet, colAsChar: 'E' })
  alignCellTextCenter({ worksheet, colAsChar: 'F' })
  alignCellTextCenter({ worksheet, colAsChar: 'H' })

  for (let row = 1; row <= 4; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns })
  }

  worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true }

  const filename = `Promoter_Holds${(tourCode || tourId) ? '_' + (tourCode || tourId) : ''}${(fromDate && toDate) ? '_' + (fromDate + '_' + toDate) : ''}.xlsx`
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

export default handler
