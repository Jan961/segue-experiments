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
import { AllocatedSeatsEditor } from '../editors/AllocatedSeatsEditor'
import { AvailableSeatEditor } from '../editors/AvailableSeatsEditor'

const availableSeatsFakeData = [
  {
    Id: 1,
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

const allocatedSeatsFakeData = [
  {
    Id: 1,
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    Id: 2,
    date: '10/10/2010',
    time: '17:30',
    name: 'Sam Smith',
    numberSeats: '1',
    allocatedSeats: '49',
    email: 'sam.smith@somedomain.co.uk'
  },
  {
    Id: 3,
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
    Id: 2,
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
  const [venueHolds, setVenueHolds] = React.useState([])
  const [venueHoldsModalOpen, setVenueHoldsModalOpen] = React.useState(false)
  const [venueHoldsEditing, setVenueHoldsEditing] = React.useState(undefined)

  // Available Seats
  const [availableSeats, setAvailableSeats] = React.useState([])
  const [availableSeatsModalOpen, setAvailableSeatsModalOpen] = React.useState(false)
  const [availableSeatsEditing, setAvailableSeatsEditing] = React.useState(undefined)

  // Allocated Seats
  const [allocatedSeats, setAllocatedSeats] = React.useState([])
  const [allocatedSeatsModalOpen, setAllocatedSeatsModalOpen] = React.useState(false)
  const [allocatedSeatsEditing, setAllocatedSeatsEditing] = React.useState(undefined)

  // Common

  const search = async () => {
    setLoading(true)
    setVenueHolds(undefined)

    // Temp
    setVenueHolds(venueHold)
    setAvailableSeats(availableSeatsFakeData)
    setAllocatedSeats(allocatedSeatsFakeData)
    setLoading(false)

    return
    const { data } = await axios.get(`/api/marketing/promoterHolds/${selected}`)
    const { venueHolds } = data
    setVenueHolds(venueHolds)
    setLoading(false)
  }

  const triggerClose = async (refresh: boolean) => {
    setVenueHoldsModalOpen(false)
    setAllocatedSeatsModalOpen(false)
    setAvailableSeatsModalOpen(false)
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

  // Available Seats
  const createAvailableSeat = () => {
    setAvailableSeatsEditing(defaultVenueHold)
    setAvailableSeatsModalOpen(true)
  }

  const editAvailableSeat = (as: any) => {
    setAvailableSeatsEditing(as)
    setAvailableSeatsModalOpen(true)
  }

  // Allocated Seats
  const createAllocatedSeat = () => {
    setAllocatedSeatsEditing(defaultVenueHold)
    setAllocatedSeatsModalOpen(true)
  }

  const editAllocatedSeat = (as: any) => {
    setAllocatedSeatsEditing(as)
    setAllocatedSeatsModalOpen(true)
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
        {venueHoldsModalOpen && (<VenueHoldsEditor open={venueHoldsModalOpen} triggerClose={triggerClose} venueHold={venueHoldsEditing} />)}
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
        <FormInputButton text="Add Available Seats" onClick={createAvailableSeat} icon={faPlus}/>
        {availableSeatsModalOpen && (<AvailableSeatEditor open={availableSeatsModalOpen} triggerClose={triggerClose} availableSeat={availableSeatsEditing} />)}
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
          {availableSeats.map((avS, idx) => (
            <Table.Row key={avS.Id} hover onClick={() => editAvailableSeat(avS)}>
              <Table.Cell>
                {avS.day}
              </Table.Cell>
              <Table.Cell>
                {avS.date}{' '}
              </Table.Cell>
              <Table.Cell>
                {avS.time}
              </Table.Cell>
              <Table.Cell>
                {avS.name}
              </Table.Cell>
              <Table.Cell>
                {avS.numberSeats}
              </Table.Cell>
              <Table.Cell>
                {avS.allocations}
              </Table.Cell>
              <Table.Cell>
                {avS.available}
              </Table.Cell>
              <Table.Cell>
                {avS.range} {avS.note}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="flex justify-between pb-4">
        <h3 className='text-xl mt-2'>Allocated Seats</h3>
        <FormInputButton text="Add Allocated Seats" onClick={createAllocatedSeat} icon={faPlus}/>
        {allocatedSeatsModalOpen && (<AllocatedSeatsEditor open={allocatedSeatsModalOpen} triggerClose={triggerClose} allocatedSeat={allocatedSeatsEditing} />)}
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
          {allocatedSeats.map((as) => (
            <Table.Row key={as.Id} hover onClick={() => editAllocatedSeat(as)}>
              <Table.Cell>
                {as.date} {as.time}{' '}
              </Table.Cell>
              <Table.Cell>
                {as.name}
              </Table.Cell>
              <Table.Cell>
                {as.numberSeats}
              </Table.Cell>
              <Table.Cell>
                {as.allocatedSeats}
              </Table.Cell>
              <Table.Cell>
                {as.email}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
