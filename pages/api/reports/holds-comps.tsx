
import { Prisma } from '@prisma/client'
import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'
import moment from 'moment'
import { COLOR_HEXCODE } from 'services/salesSummaryService'

type TBookingHolds = {
  FullTourCode : string,
  VenueCode : string,
  VenueName : string,
  VenueSeats : number,
  BookingFirstDate : string,
  HoldOrComp : string,
  Code : string,
  Name : string,
  Seats : string,
  SoldSeats : number,
  ReservedSeats : number | null
}

type TBookingCodeAndName = {
  HoldOrComp : string,
  Code : string,
  Name : string,
  Seats : string,
};

type TBookingHoldsGrouped = {
  FullTourCode : string,
  VenueCode : string,
  VenueName : string,
  VenueSeats : number,
  BookingFirstDate : string,
  SoldSeats : number,
  ReservedSeats : number | null
  data: TBookingCodeAndName[]
}

type TBookingHoldsGroupedByCommonKey = {
  [key:string]: TBookingHoldsGrouped
}

const alignColumnTextRight = ({ worksheet, colAsChar }: {worksheet: any, colAsChar: string}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' }
  })
}

const makeRowTextBold = ({ worksheet, row }: {worksheet: any, row: number}) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true }
  })
}

const makeTopBorderDouble = ({ worksheet, row, col }: {worksheet: any, row: number, col: number}) => {
  worksheet.getCell(row, col).border = { top: { style: 'double', color: { argb: COLOR_HEXCODE.BLACK } } }
}

const styleHeader = ({ worksheet, row, numberOfColumns }: {worksheet: any, row: number, numberOfColumns: number}) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col)
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } }
    cell.alignment = { horizontal: 'left' }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.BLUE }
    }
  }
}

const getAggregateKey = (
  { FullTourCode, VenueCode, VenueName, BookingFirstDate }
  :{FullTourCode: TBookingHolds['FullTourCode'], VenueCode: TBookingHolds['VenueCode'], VenueName: TBookingHolds['VenueName'], BookingFirstDate: TBookingHolds['BookingFirstDate']}
) => `${FullTourCode} | ${VenueCode} | ${VenueName} | ${BookingFirstDate}`

const getTypeAndCodeKey = ({ HoldOrComp, Code }: {HoldOrComp: TBookingCodeAndName['HoldOrComp'], Code: TBookingCodeAndName['Code']}) => `${HoldOrComp} | ${Code}`

const groupBasedOnTypeAndCode = ({ allBookingCodeAndNameForADate }: {allBookingCodeAndNameForADate: TBookingCodeAndName[]}): TBookingCodeAndName[] => {
  const accumulationBasedOnTypeAndCode: {[key: string]: TBookingCodeAndName} = allBookingCodeAndNameForADate.reduce((acc, x: TBookingCodeAndName) => {
    const key = getTypeAndCodeKey({ HoldOrComp: x.HoldOrComp, Code: x.Code })
    const value = acc[key]
    if (value) {
      return {
        ...acc,
        [key]: {
          ...value,
          Seats: value.Seats + x.Seats
        }
      }
    }
    return {
      ...acc,
      [key]: {
        ...x
      }
    }
  }, {})
  return Object.values(accumulationBasedOnTypeAndCode)
}

const groupBasedOnVenueAndSameDate = ({ fetchedValues }: {fetchedValues: TBookingHolds[]}): TBookingHoldsGroupedByCommonKey => fetchedValues.reduce((acc, obj: TBookingHolds) => {
  const key: string = getAggregateKey(obj)
  const val: TBookingHoldsGrouped = acc[key]
  if (val) {
    return {
      ...acc,
      [key]: {
        ...val,
        data: [
          ...val.data,
          {
            HoldOrComp: obj.HoldOrComp,
            Code: obj.Code,
            Name: obj.Name,
            Seats: obj.Seats
          }
        ]
      }
    }
  }
  return {
    ...acc,
    [key]: {
      FullTourCode: obj.FullTourCode,
      VenueCode: obj.VenueCode,
      VenueName: obj.VenueName,
      VenueSeats: obj.VenueSeats,
      BookingFirstDate: obj.BookingFirstDate,
      SoldSeats: obj.SoldSeats,
      ReservedSeats: obj.ReservedSeats,
      data: [
        {
          HoldOrComp: obj.HoldOrComp,
          Code: obj.Code,
          Name: obj.Name,
          Seats: obj.Seats
        }
      ]
    }
  }
}, {})

const getZeroOrNegativeValue = (val: number | null): string => val ? `-${val}` : '0'

const makeCellTextBold = ({ worksheet, row, col }: {worksheet: any, row: number, col: number}) => {
  worksheet.getCell(row, col).font = { bold: true }
}

const handler = async (req, res) => {
  const { tourCode, fromDate, toDate, venue, bookingStatus } = JSON.parse(req.body) || {}
  const workbook = new ExcelJS.Workbook()
  const conditions: Prisma.Sql[] = []
  if (tourCode) {
    conditions.push(Prisma.sql`FullTourCode = ${tourCode}`)
  }
  if (venue) {
    conditions.push(Prisma.sql`VenueCode = ${venue}`)
  }
  if (fromDate && toDate) {
    conditions.push(Prisma.sql`BookingFirstDate BETWEEN ${fromDate} AND ${toDate}`)
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
  const data: TBookingHolds[] = await prisma.$queryRaw`SELECT * FROM BookingHoldCompsView ${where} ORDER BY BookingFirstDate;`

  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
  })

  worksheet.addRow((['BOOKING HOLDS/COMPS REPORT']))
  const date = new Date()
  worksheet.addRow(([`Exported: ${moment(date).format('DD/MM/YYYY')} at ${moment(date).format('hh:mm')}`]))
  worksheet.addRow((['TOUR', 'VENUE', '', 'SHOW']))
  worksheet.addRow((['CODE', 'CODE', 'NAME', 'DATE', 'TYPE', 'CODE', 'NAME', 'SEATS', 'TOTAL', 'REMAINING']))

  const numberOfColumns = worksheet.columnCount

  const groupBasedOnVenueAndDate: TBookingHoldsGroupedByCommonKey = groupBasedOnVenueAndSameDate({ fetchedValues: data })
  const groupBasedOnVenueAndDateForAllTypes: TBookingHoldsGrouped[] = Object.values(groupBasedOnVenueAndDate).map((x: TBookingHoldsGrouped) => ({ ...x, data: groupBasedOnTypeAndCode({ allBookingCodeAndNameForADate: x.data }) }))

  let row = 5
  Object.values(groupBasedOnVenueAndDateForAllTypes).forEach((x: TBookingHoldsGrouped) => {
    worksheet.addRow([])
    row++
    worksheet.addRow([x.FullTourCode, x.VenueCode, x.VenueName, x.BookingFirstDate, '', '', 'Capacity', '', x.VenueSeats])
    makeCellTextBold({ worksheet, row, col: 7 })
    makeCellTextBold({ worksheet, row, col: 9 })
    row++

    let totalBooked = '0'
    x.data.forEach(({ HoldOrComp, Code, Name, Seats }: TBookingCodeAndName) => {
      totalBooked = String(parseInt(totalBooked) + parseInt(Seats))
      worksheet.addRow(['', '', '', '', HoldOrComp, Code, Name, parseInt(Seats)])
      row++
    })

    worksheet.addRow(['', '', '', '', '', '', 'Total Holds', '', getZeroOrNegativeValue(parseInt(totalBooked))])
    makeRowTextBold({ worksheet, row })
    for (let i = 7; i <= 9; i++) {
      makeTopBorderDouble({ worksheet, row, col: i })
    }
    row++
    worksheet.addRow(['', '', '', '', '', '', 'Seats Sold', '', getZeroOrNegativeValue(x.SoldSeats)])
    makeRowTextBold({ worksheet, row })
    row++
    worksheet.addRow(['', '', '', '', '', '', 'Seats Reserved', '', getZeroOrNegativeValue(x.ReservedSeats)])
    makeRowTextBold({ worksheet, row })
    row++
    worksheet.addRow(['', '', '', '', '', '', 'Remaining Seats', '', '', parseInt(x.VenueSeats as any as string) - (parseInt(totalBooked) + (parseInt(x.SoldSeats as any as string) || 0) + (parseInt(x.ReservedSeats as any as string) || 0))])
    for (let i = 7; i <= 10; i++) {
      makeTopBorderDouble({ worksheet, row, col: i })
    }
    makeRowTextBold({ worksheet, row })
    row++
  })

  worksheet.mergeCells('A1:C1')
  worksheet.mergeCells('A2:C2')
  worksheet.mergeCells('B3:C3')

  for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    worksheet.getColumn(char).width = 15
  }
  alignColumnTextRight({ worksheet, colAsChar: 'D' })
  alignColumnTextRight({ worksheet, colAsChar: 'H' })
  alignColumnTextRight({ worksheet, colAsChar: 'I' })
  alignColumnTextRight({ worksheet, colAsChar: 'J' })

  for (let row = 1; row <= 4; row++) {
    styleHeader({ worksheet, row, numberOfColumns })
  }

  for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    worksheet.getColumn(char).width = 15
  }

  const filename = `Holds_Comps_${tourCode}_${fromDate}_${toDate}.xlsx`
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

export default handler
