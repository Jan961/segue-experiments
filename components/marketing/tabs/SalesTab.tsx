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
import numeral from 'numeral'
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
        setBookingSales([])
        const { data } = await axios.get(`/api/marketing/sales/read/${selected}`)
        setBookingSales(data)
        setTimeout(() => {
          document.getElementById?.('final')?.scrollIntoView?.({ behavior: 'smooth' })
        }, 0)
      } catch (error:any) {
        setLoading(false)
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
  const getChange = (index:number) => {
    let valueChange:number, seatsChange:number
    if (index === 0) {
      valueChange = bookingSales?.[index].totalValue
      seatsChange = bookingSales?.[index].seatsSold
    } else {
      valueChange = bookingSales?.[index].totalValue - bookingSales?.[index - 1].totalValue
      seatsChange = bookingSales?.[index].seatsSold - bookingSales?.[index - 1].seatsSold
    }
    return { valueChange, seatsChange }
  }
  return (
    <>
      <div className='grid grid-cols-12 gap-2 overflow-hidden'>
        <div className="col-span-8 md:col-span-9 lg:col-span-10 mb-4">
          <Table className='mt-4 text-sm table-auto !min-w-0 h-full sticky-header-table' style={{ maxWidth: '' }}>
            <Table.HeaderRow>
              <Table.HeaderCell className='w-20'>
              Week
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Week of
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Sold
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Sold %
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Reserved
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Reserved %
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Total Value
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Value Change
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Total Hold
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Change
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Activity
              </Table.HeaderCell>
            </Table.HeaderRow>
            <Table.Body className='h-full overflow-y-auto' style={{ maxHeight: 'calc(100vh - 440px)' }}>
              {bookingSales.map((sale, i) => {
                const { valueChange, seatsChange } = getChange(i)
                const isLast = (bookingSales?.length - 1) === i
                return (
                  <Table.Row id={isLast ? 'final' : null} key={sale.week}>
                    <Table.Cell className="whitespace-nowrap max-w-fit">
                      {isLast ? 'Final' : sale.week.replace('Week-', 'Wk ')}
                    </Table.Cell>
                    <Table.Cell>
                      {sale.weekOf}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {numeral(sale.seatsSold).format('0,0')}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {((sale.seatsSold / sale.capacity) * 100).toFixed(2)} %
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {sale.reservations}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {numeral(sale.reserved).format('0,0')}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {sale.venueCurrencySymbol + numeral(sale.totalValue).format('0,0.00')}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {sale.venueCurrencySymbol + numeral(valueChange).format('0,0.00')}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {sale.totalHolds}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {seatsChange}
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
                )
              }
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  )
}
