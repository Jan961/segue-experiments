import {
  faBook,
  faSquareXmark,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { Spinner } from 'components/global/Spinner'
import { Table } from 'components/global/table/Table'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { NoDataWarning } from '../NoDataWarning'

export const SalesTab = () => {
  const [bookingSales, setBookingSales] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const { selected } = useRecoilValue(bookingJumpState)

  React.useEffect(() => {
    const getBookingSales = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/marketing/sales/read/${selected}`)
        console.log('bookingSale data: ', data)
        setBookingSales(data)
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

  if (loading) return (<Spinner size='lg' className="mt-8" />)

  if (!bookingSales || !bookingSales.length) return (<NoDataWarning />)

  return (
    <div className={'flex bg-transparent'}>
      <div className="flex-auto mx-4  overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>
              Week
            </Table.HeaderCell>
            <Table.HeaderCell>
              Week of
            </Table.HeaderCell>
            <Table.HeaderCell>
              Seat Sold (n)
            </Table.HeaderCell>
            <Table.HeaderCell>
              Seat Sold %
            </Table.HeaderCell>
            <Table.HeaderCell>
              Reservations (n)
            </Table.HeaderCell>
            <Table.HeaderCell>
              Reserved (%)
            </Table.HeaderCell>
            <Table.HeaderCell>
              Total Value
            </Table.HeaderCell>
            <Table.HeaderCell>
              Value Change
            </Table.HeaderCell>
            <Table.HeaderCell>
              Total Hold
            </Table.HeaderCell>
            <Table.HeaderCell>
              Seats Change
            </Table.HeaderCell>
            <Table.HeaderCell>
              Activity
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {bookingSales.map((sale) => (
              <Table.Row key={sale.week}>
                <Table.Cell className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white border border-l-0 sm:w-auto sm:max-w-none sm:pl-6">
                  {sale.week}
                </Table.Cell>
                <Table.Cell>
                  {sale.weekOf}
                </Table.Cell>
                <Table.Cell>
                  {sale.seatsSold}
                </Table.Cell>
                <Table.Cell>
                  {/* TO BE ADDED {sale.seatsSold.percentage} */}
                </Table.Cell>
                <Table.Cell>
                  {sale.reservations}
                </Table.Cell>
                <Table.Cell>
                  {sale.reserved}
                </Table.Cell>
                <Table.Cell>
                  {/* TO BE ADDED {sale.totalValue} */}
                </Table.Cell>
                <Table.Cell>
                  {sale.valueChange}
                </Table.Cell>
                <Table.Cell>
                  {sale.totalHolds}
                </Table.Cell>
                <Table.Cell>
                  {sale.seatsChange}
                </Table.Cell>
                <Table.Cell right className="py-4 pl-3 pr-4 font-medium sm:pr-6 border-r-0">
                  <a
                    href="#"
                    className="text-primary-blue hover:text-soft-primary-blue mr-1"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span className="sr-only">Single Seat</span>
                  </a>
                  <a
                    href="#"
                    className="text-primary-blue hover:text-soft-primary-blue mr-1"
                  >
                    <FontAwesomeIcon icon={faBook} />
                    <span className="sr-only">Brochure Released</span>
                  </a>
                  <a
                    href="#"
                    className="text-primary-blue hover:text-soft-primary-blue mr-1"
                  >
                    <FontAwesomeIcon icon={faSquareXmark} />
                    <span className="sr-only">Not on Sale</span>
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
