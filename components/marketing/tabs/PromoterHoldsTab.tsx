import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { HardCodedWarning } from '../HardCodedWarning'
import { Table } from 'components/global/table/Table'
import React from 'react'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { VenueHoldsEditor } from '../editors/VenueHoldsEditor'
import { LoadingTab } from './LoadingTab'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'

const holdsTh = [
  {
    day: 'Monday',
    date: '10/10/2022',
    time: '17:30',
    name: 'Peter Griffin',
    numberSeats: '4',
    allocations: '1-50',
    available: '1-50',
    range: '1-2',
    note: 'Some note'
  }
]

const holdsPromoter = [
  {
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    date: '11/05/2011',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  }
]

const venueHold = [
  {
    Id: 1,
    Role: 'Lighting Desk',
    Qty: 4
  },
  {
    Id: 1,
    Role: 'Sound Desk',
    Qty: 8
  }
]

const defaultVenueHold = {
  Id: undefined,
  Role: '',
  Qty: 1
}

export const PromoterHoldsTab = () => {
  const { selected } = useRecoilValue(bookingJumpState)
  const [loading, setLoading] = React.useState(true)

  // Venue Holds
  const [venueHolds, setVenueHolds] = React.useState(venueHold)
  const [venueHoldsModalOpen, setVenueHoldsModalOpen] = React.useState(false)
  const [venueHoldsEditing, setVenueHoldsEditing] = React.useState(undefined)

  // Allocated Seats

  // Common

  const search = async () => {
    setLoading(true)
    setVenueHolds(undefined)

    // Temp
    setVenueHolds(venueHold)
    setLoading(false)

    return
    const { data } = await axios.get(`/api/marketing/contactNotes/${selected}`)
    const { venueHolds } = data
    setVenueHolds(venueHolds)
    setLoading(false)
  }

  const triggerClose = async (refresh: boolean) => {
    setVenueHoldsModalOpen(false)
    if (refresh) await search()
  }

  // Venue Hold

  const createVenueHold = () => {
    setVenueHoldsEditing(defaultVenueHold)
    setVenueHoldsModalOpen(true)
  }

  const editVenueHold = (venueHold: any) => {
    setVenueHoldsEditing(venueHold)
    setVenueHoldsModalOpen(true)
  }

  React.useEffect(() => {
    search()
  }, [selected])

  if (loading) return (<LoadingTab />)

  return (
    <>
      <HardCodedWarning />
      <div className="flex justify-between pb-4">
        <h3 className='text-xl mt-2'>Venue Holds</h3>
        <FormInputButton text="Add New Venue Hold" onClick={createVenueHold} icon={faPlus}/>
        {venueHoldsModalOpen && (<VenueHoldsEditor open={venueHoldsModalOpen} triggerClose={triggerClose} bookingId={selected} venueHold={venueHoldsEditing} />)}
      </div>
      <Table className="mb-8">
        <Table.HeaderRow>
          <Table.HeaderCell>
          Role
          </Table.HeaderCell>
          <Table.HeaderCell>
          Quantity
          </Table.HeaderCell>
        </Table.HeaderRow>
        { venueHolds.map((vh) => (
          <Table.Row key={vh.Id} hover onClick={() => editVenueHold(vh)}>
            <Table.Cell>
              {vh.Role}
            </Table.Cell>
            <Table.Cell>
              {vh.Qty}
            </Table.Cell>
          </Table.Row>
        ))
        }
      </Table>
      <div className="flex justify-between pb-4">
        <h3 className='text-xl mt-2'>Available Seats</h3>
        <FormInputButton text="Add Available Seats" onClick={console.log} icon={faPlus}/>
      </div>
      <Table className='mb-8'>
        <Table.HeaderRow>
          <Table.HeaderCell>
              Day
          </Table.HeaderCell>
          <Table.HeaderCell>
              Date
          </Table.HeaderCell>
          <Table.HeaderCell>
              Time
          </Table.HeaderCell>
          <Table.HeaderCell>
              Name
          </Table.HeaderCell>
          <Table.HeaderCell>
              Seats
          </Table.HeaderCell>
          <Table.HeaderCell>
              Allocation
          </Table.HeaderCell>
          <Table.HeaderCell>
              Available
          </Table.HeaderCell>
          <Table.HeaderCell>
              Seat Range / Notes
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {holdsTh.map((holdTh, idx) => (
            <Table.Row key={holdTh.date + holdTh.time}>
              <Table.Cell>
                {holdTh.day}
              </Table.Cell>
              <Table.Cell>
                {holdTh.date}{' '}
              </Table.Cell>
              <Table.Cell>
                {holdTh.time}
              </Table.Cell>
              <Table.Cell>
                {holdTh.name}
              </Table.Cell>
              <Table.Cell>
                {holdTh.numberSeats}
              </Table.Cell>
              <Table.Cell>
                {holdTh.allocations}
              </Table.Cell>
              <Table.Cell>
                {holdTh.available}
              </Table.Cell>
              <Table.Cell>
                {holdTh.range} {holdTh.note}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="flex justify-between pb-4">
        <h3 className='text-xl mt-2'>Allocated Seats</h3>
        <FormInputButton text="Add Allocated Seats" onClick={console.log} icon={faPlus}/>
      </div>
      <Table className='mb-8'>
        <Table.HeaderRow>
          <Table.HeaderCell>
            Date / Time
          </Table.HeaderCell>
          <Table.HeaderCell>
            Name
          </Table.HeaderCell>
          <Table.HeaderCell >
            No Seats
          </Table.HeaderCell>
          <Table.HeaderCell>
            Allocated Seats
          </Table.HeaderCell>
          <Table.HeaderCell>
            Email
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {holdsPromoter.map((holdTh, idx) => (
            <Table.Row key={holdTh.date + holdTh.time}>
              <Table.Cell>
                {holdTh.date} {holdTh.time}{' '}
              </Table.Cell>
              <Table.Cell>
                {holdTh.name}
              </Table.Cell>
              <Table.Cell>
                {holdTh.numberSeats}
              </Table.Cell>
              <Table.Cell>
                {holdTh.allocatedSeats}
              </Table.Cell>
              <Table.Cell>
                {holdTh.email}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
