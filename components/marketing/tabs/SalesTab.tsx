import {
  IconDefinition,
  faBook,
  faSquareXmark,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { Table } from 'components/global/table/Table'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { NoDataWarning } from '../NoDataWarning'
import { LoadingTab } from './LoadingTab'
import classNames from 'classnames'

interface IndicatorProps { icon: IconDefinition, active: boolean, tooltip: string }
const Indicator = ({ icon, active = false, tooltip }: IndicatorProps) => {
  let baseClass = 'text-primary-blue p-1'
  baseClass = active ? baseClass : classNames(baseClass, 'opacity-10')
  return (
    <li title={tooltip} className={baseClass}>
      <FontAwesomeIcon icon={icon} />
      <span className="sr-only">{ tooltip }</span>
    </li>
  )
}

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

  if (loading) return (<LoadingTab />)

  if (!bookingSales || !bookingSales.length) return (<NoDataWarning />)

  return (
    <>
      <Table className='mt-8'>
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
          {bookingSales.map((sale, i) => (
            <Table.Row key={sale.week}>
              <Table.Cell className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium border border-l-0 sm:w-auto sm:max-w-none sm:pl-6">
                {sale.week.replace('Week-', '')}
              </Table.Cell>
              <Table.Cell>
                {sale.weekOf}
              </Table.Cell>
              <Table.Cell>
                {sale.seatsSold}
              </Table.Cell>
              <Table.Cell>
                {sale.seatsSalePercentage ? sale.seatsSalePercentage.toFixed(1) : ''} %
              </Table.Cell>
              <Table.Cell>
                {sale.reservations}
              </Table.Cell>
              <Table.Cell>
                {sale.reserved}
              </Table.Cell>
              <Table.Cell>
                {`${sale.VenueCurrencySymbol} ${sale.totalValue}`}
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
              <Table.Cell >
                <ul className="flex">
                  <Indicator
                    tooltip='Single Seat'
                    active={sale.isSingleSeats}
                    icon={faUser}
                  />
                  <Indicator
                    tooltip='Brochure Released'
                    active={sale.isBrochureReleased}
                    icon={faBook}
                  />
                  <Indicator
                    tooltip='Not on Sale'
                    active={sale.isNotOnSale}
                    icon={faSquareXmark}
                  />
                </ul>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
