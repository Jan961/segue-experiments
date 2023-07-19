import { Table } from 'components/global/table/Table'
import { HardCodedWarning } from '../HardCodedWarning'
import React from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { LoadingTab } from './LoadingTab'

export const ArchivedSalesTab = () => {
  const [archivedSales, setArchivedSales] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const { selected } = useRecoilValue(bookingJumpState)

  React.useEffect(() => {
    const getBookingSales = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/marketing/archivedSales/${selected}`)
        setArchivedSales(data)
      } catch (error:any) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (selected) {
      getBookingSales()
    }
  }, [selected])

  if (loading) return (<LoadingTab />)

  return (
    <>
      <HardCodedWarning message="This is hard-coded server-side"/>
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
          {archivedSales.map((sale) => (
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
}
