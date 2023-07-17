import { Table } from 'components/global/table/Table'
import { HardCodedWarning } from '../HardCodedWarning'

const sales = [
  { week: -51, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -50, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -49, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -48, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -47, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -46, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -45, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -44, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -43, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -42, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -41, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -40, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -39, weekOf: '10/10/2023', num: 0, value: 1 }
]

export const ArchivedSalesTab = () => (
  <>
    <HardCodedWarning />
    <div className={'mb-1 space-x-3 pb-4'}>
      <button className={'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}>For this Venue </button>
      <button className={'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}>For this Town </button>
    </div>
    <Table>
      <Table.HeaderRow>
        <Table.HeaderCell>
          Week
        </Table.HeaderCell>
        <Table.HeaderCell>
          Week of
        </Table.HeaderCell>
        <Table.HeaderCell>
          Num
        </Table.HeaderCell>
        <Table.HeaderCell>
          S Value
        </Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {sales.map((sale, idx) => (
          <Table.Row key={sale.weekOf}>
            <Table.Cell>
              {sale.week}
            </Table.Cell>
            <Table.Cell>
              {sale.weekOf}
            </Table.Cell>
            <Table.Cell>
              {sale.num}
            </Table.Cell>
            <Table.Cell>
              {sale.value}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </>

)
