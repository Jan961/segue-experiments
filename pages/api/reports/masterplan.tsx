
import { Prisma } from '@prisma/client'
import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'
import moment from 'moment'
import Decimal from 'decimal.js'
import { COLOR_HEXCODE, colorCell, colorTextAndBGCell, fillRowBGColorAndTextColor } from 'services/salesSummaryService'

type SCHEDULE_VIEW = {
  TourId : number,
  FullTourCode : string,
  ShowName : string,
  TourStartDate : string,
  TourEndDate : string,
  EntryDate : string,
  TourWeekNum : number,
  EntryName : string,
  Location : string,
  PencilNum : number | null,
  VenueSeats : number | null,
  Mileage : number | null,
  TimeMins : number | null
}

type UniqueHeadersObject = {
  FullTourCode: string,
  ShowName: string
}

enum ALIGNMENT {
  CENTER = 'center',
  RIGHT = 'right',
  LEFT = 'left'
}

const alignColumn = ({ worksheet, colAsChar, align }: {worksheet: any, colAsChar: string, align: ALIGNMENT}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: align, wrapText: true }
  })
}

const styleHeader = ({ worksheet, row, numberOfColumns }: {worksheet: any, row: number, numberOfColumns: number}) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col)
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } }
    cell.alignment = { horizontal: ALIGNMENT.LEFT }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.BLUE }
    }
  }
}

const alignCellText = ({ worksheet, row, col, align }: { worksheet: any, row: number, col: number, align: ALIGNMENT }) => {
  worksheet.getCell(row, col).alignment = { horizontal: align }
}

const getKey = ({ FullTourCode, ShowName, EntryDate }) => `${FullTourCode} - ${ShowName} - ${EntryDate}`
const formatDate = (date) => moment(date).format('DD/MM/YY')
const getShowAndTourKey = ({ FullTourCode, ShowName }) => `${FullTourCode} - ${ShowName}`

const handler = async (req, res) => {
  const { fromDate, toDate } = JSON.parse(req.body) || {}

  //   const fromDate = '2021-11-01'
  //   const toDate = '2024-05-05'
  const formatedFromDate = formatDate(fromDate)
  const formatedToDate = formatDate(toDate)
  if (!fromDate || !toDate) {
    throw new Error('Params are missing')
  }
  const conditions: Prisma.Sql[] = [Prisma.sql`EntryDate BETWEEN ${fromDate} AND ${toDate}`]
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
  const data: SCHEDULE_VIEW[] = await prisma.$queryRaw`select * FROM ScheduleView ${where} order by EntryDate;`

  const workbook = new ExcelJS.Workbook()
  const formattedData = data.map(x => ({
    ...x,
    EntryDate: moment(x.EntryDate).format('YYYY-MM-DD'),
    TourStartDate: moment(x.TourStartDate).format('YYYY-MM-DD'),
    TourEndDate: moment(x.TourEndDate).format('YYYY-MM-DD')
  }))

  const showNameAndTourCode: {[key: string]: string[]} = formattedData.reduce((acc, x) => {
    const value = acc[x.ShowName]
    if (value && value?.length) {
      if (!value.includes(x.FullTourCode)) {
        return {
          ...acc,
          [x.ShowName]: [...value, x.FullTourCode]
        }
      }
      return acc
    }
    return {
      ...acc,
      [x.ShowName]: [x.FullTourCode]
    }
  }, {})

  const destinctShowNames: UniqueHeadersObject[] = Object.keys(showNameAndTourCode).map(key => {
    return showNameAndTourCode[key].map(code => ({ ShowName: key, FullTourCode: code }))
  }).reduce((acc, arr) => ([...acc, ...arr]), [])

  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
  })

  worksheet.addRow([`Jendagi Rolling Masterplan ${formatedFromDate} to ${formatedToDate}`])
  const date = new Date()
  worksheet.addRow([`Exported: ${moment(date).format('DD/MM/YYYY')} at ${moment(date).format('hh:mm')}`])
  worksheet.addRow([])
  worksheet.addRow(['', '', ...destinctShowNames.map(x => x.ShowName)])
  worksheet.addRow(['DAY', 'DATE', ...destinctShowNames.map(x => x.FullTourCode)])
  worksheet.addRow([])

  const map: {[key: string]: SCHEDULE_VIEW} = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {})
  const showNameAndTourMap: {[key: string]: SCHEDULE_VIEW} = formattedData.reduce((acc, x) => ({ ...acc, [getShowAndTourKey(x)]: x }), {})

  const headerWeeks = destinctShowNames.reduce((acc, { ShowName, FullTourCode }) => {
    const key = getShowAndTourKey({ FullTourCode, ShowName })
    const value = showNameAndTourMap[key]
    if (!value) {
      throw new Error('Missing Data')
    }

    const daysDiff = moment(fromDate).diff(moment(value.TourStartDate), 'days')
    let week
    if (daysDiff >= 0 && daysDiff <= 6) {
      week = 1
    } else if (daysDiff >= 7) {
      week = Number(new Decimal(daysDiff).div(7).toFixed(0)) + 1
    } else {
      week = Number(new Decimal(daysDiff).div(7).toFixed(0)) - 1
    }
    return {
      ...acc,
      [getShowAndTourKey({ FullTourCode, ShowName })]: week
    }
  }, {}) || {}

  const weeks = destinctShowNames.reduce((acc, { FullTourCode, ShowName }) => {
    const key = getShowAndTourKey({ FullTourCode, ShowName })
    const value = headerWeeks[key]

    if (!value) {
      throw new Error(' Something went wrong')
    }
    if (value === -1) {
      headerWeeks[key] = 1
    } else {
      headerWeeks[key]++
    }

    return [...acc, `Week ${value}`]
  }, [])
  worksheet.addRow(['Week Minus', '', ...weeks])
  fillRowBGColorAndTextColor({worksheet, row: 7, textColor: COLOR_HEXCODE.YELLOW, cellColor: COLOR_HEXCODE.BLUE, isBold: true})

  const daysDiff = moment(toDate).diff(moment(fromDate), 'days')

  let rowNo = 6
  for (let i = 1; i <= daysDiff; i++) {
    const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd')
    const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day')).format('YYYY-MM-DD')
    const date = formatDate(dateInIncomingFormat)

    const values: string[] = destinctShowNames.map(({ FullTourCode, ShowName }) => {
      const key = getKey({ FullTourCode, ShowName, EntryDate: dateInIncomingFormat })
      const value = map[key]
      if (value) {
        return value.EntryName
      }
      return ''
    })

    worksheet.addRow([weekDay, date, ...values])
    rowNo++
    if (weekDay === 'Monday') {
      colorCell({ worksheet, row: rowNo + 1, col: 1, argbColor: COLOR_HEXCODE.ORANGE })
      colorCell({ worksheet, row: rowNo + 1, col: 2, argbColor: COLOR_HEXCODE.ORANGE })
    }

    const targetCellIdx: number[] = values.map((value, idx) => {
      if (['Rehearsal Day', 'Day Off', 'Travel Day'].includes(value)) {
        return idx + 1 + 2
      }
    }).filter(x => !!x) as number[]
    targetCellIdx.forEach(col => colorTextAndBGCell({ worksheet, row: rowNo + 1, col, textColor: COLOR_HEXCODE.YELLOW, cellColor: COLOR_HEXCODE.RED }))

    if (i % 7 === 0) {
      worksheet.addRow([])
      rowNo++
      const weeks = destinctShowNames.reduce((acc, { FullTourCode, ShowName }) => {
        const key = getShowAndTourKey({ FullTourCode, ShowName })
        const value = headerWeeks[key]

        if (!value) {
          throw new Error(' Something went wrong')
        }
        if (value === -1) {
          headerWeeks[key] = 1
        } else {
          headerWeeks[key]++
        }

        return [...acc, `Week ${value}`]
      }, [])
      worksheet.addRow(['Week Minus', '', ...weeks])
      rowNo++
      fillRowBGColorAndTextColor({ worksheet, row: rowNo + 1, textColor: COLOR_HEXCODE.YELLOW, cellColor: COLOR_HEXCODE.BLUE, isBold: true })
    }
  }

  const numberOfColumns = worksheet.columnCount

  worksheet.mergeCells('A1:D1')
  worksheet.mergeCells('A2:C2')

  for (let row = 1; row < 6; row++) {
    styleHeader({ worksheet, row, numberOfColumns })
  }

  for (let char = 'A', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    if (char === 'A' || char === 'B') {
      worksheet.getColumn(char).width = 12
    } else {
      worksheet.getColumn(char).width = 20
    }
    if (char !== 'A') {
      alignColumn({ worksheet, colAsChar: char, align: ALIGNMENT.CENTER })
    }
  }

  alignCellText({ worksheet, row: 1, col: 1, align: ALIGNMENT.LEFT })
  alignCellText({ worksheet, row: 2, col: 1, align: ALIGNMENT.LEFT })
  alignCellText({ worksheet, row: 5, col: 2, align: ALIGNMENT.LEFT })

  worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true }

  const filename = 'Master Plan.xlsx'
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

export default handler
