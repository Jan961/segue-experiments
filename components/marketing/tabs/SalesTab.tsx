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
import { dateToSimple } from 'services/dateService'
import moment from 'moment'

interface IndicatorProps { icon: IconDefinition, active: boolean, tooltip: string, onChange:(status:boolean)=>void }
const Indicator = ({ icon, active = false, tooltip, onChange = () => null }: IndicatorProps) => {
  let baseClass = 'text-primary-blue p-1'
  baseClass = active ? baseClass : classNames(baseClass, 'opacity-10')
  return (
    <li title={tooltip} onClick={(e:any) => {
      e.stopPropagation?.()
      onChange?.(!active)
    }} className={classNames('cursor-pointer', baseClass)}>
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
  const updateSaleSet = (BookingId:number, SalesFigureDate:string, update:any) => {
    axios.put('/api/marketing/sales/salesSet/update', { BookingId, SalesFigureDate, ...update }).catch((error:any) => console.log('failed to update sale', error))
  }
  const onChange = (key:string, value:boolean, sale:any) => {
    updateSaleSet(selected, moment(sale.weekOf)?.toISOString()?.substring?.(0, 10), { [key.replace('is', 'Set')]: value })
    setBookingSales(prevSales => prevSales.map(s => {
      if (sale.weekOf === s.weekOf && sale.week === s.week) {
        return { ...s, [key]: value }
      }
      return s
    }))
  }
  return (
    <>
      <div className='grid grid-cols-12 gap-2 overflow-hidden'>
        <div className="col-span-8 md:col-span-9 lg:col-span-10 mb-4">
          <Table className='mt-4 text-sm table-auto !min-w-0'>
            <Table.HeaderRow>
              <Table.HeaderCell className='w-20 rounded-tl-lg'>
              Week
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Week of
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Sold (n)
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Sold (%)
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Reserved (n)
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Reserved (%)
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Total Value
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Value Change
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Total Holds
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20'>
              Seats Change
              </Table.HeaderCell>
              <Table.HeaderCell className='w-20 rounded-tr-lg'>
              Activity
              </Table.HeaderCell>
            </Table.HeaderRow>
            <Table.Body className='h-full overflow-y-auto'>
              {bookingSales.map((sale, i) => {
                const { valueChange, seatsChange } = getChange(i)
                let colorCode = ''
                if (sale.isSingleSeats)colorCode = 'bg-primary-orange text-primary-yellow'
                if (sale.isBrochureReleased)colorCode = 'bg-primary-yellow text-black'
                if (sale.isNotOnSale)colorCode = 'bg-soft-primary-green text-black'
                return (
                  <Table.Row id={sale.isFinal ? 'final' : null} key={sale.week}>
                    <Table.Cell className={classNames('whitespace-nowrap max-w-fit', colorCode)}>
                      {sale.isFinal ? 'Final' : sale.week.replace('Week-', 'Wk ')}
                    </Table.Cell>
                    <Table.Cell className={classNames(colorCode)}>
                      {dateToSimple(sale.weekOf)}
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
                          onChange={(value) => onChange('isSingleSeats', value, sale)}
                        />
                        <Indicator
                          tooltip='Brochure Released'
                          active={sale.isBrochureReleased}
                          icon={faBook}
                          onChange={(value) => onChange('isBrochureReleased', value, sale)}
                        />
                        <Indicator
                          tooltip='Not on Sale'
                          active={sale.isNotOnSale}
                          icon={faSquareXmark}
                          onChange={(value) => onChange('isNotOnSale', value, sale)}
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
