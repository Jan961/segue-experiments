import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { Table } from 'components/global/table/Table'
import { NoDataWarning } from 'components/marketing/NoDataWarning'
import { AllocatedSeatsEditor } from 'components/marketing/editors/AllocatedSeatsEditor'
import { AvailableSeatsEditor } from 'components/marketing/editors/AvailableSeatsEditor'
import React from 'react'
import { dateTimeToTime } from 'services/dateService'

interface PerformanceSectionProps {
  perf: any
  triggerSearch: () => void
}

export const PerformanceSection = ({ perf, triggerSearch }: PerformanceSectionProps) => {
  // Allocated Seats
  const [allocatedSeatsModalOpen, setAllocatedSeatsModalOpen] = React.useState(false)
  const [allocatedSeatsEditing, setAllocatedSeatsEditing] = React.useState(undefined)
  const [availableSeatsModalOpen, setAvailableSeatsModalOpen] = React.useState(false)

  const triggerClose = async (refresh: boolean) => {
    setAvailableSeatsModalOpen(false)
    setAllocatedSeatsModalOpen(false)
    if (refresh) await triggerSearch()
  }

  // Allocated Seats
  const createAllocatedSeat = (acId) => {
    setAllocatedSeatsEditing({ AvailableCompId: acId, Seats: 0 })
    setAllocatedSeatsModalOpen(true)
  }

  const editAllocatedSeat = (as: any) => {
    setAllocatedSeatsEditing(as)
    setAllocatedSeatsModalOpen(true)
  }

  const max = perf.totalAvailable - perf.totalAllocated

  return (
    <>
      <div className='flex my-2 items-center'>
        <h2 className="text-lg font-bold mr-4">{dateTimeToTime(perf.info.Date)}</h2>
        <div className='text-lg'>
          Seats Available: {perf.totalAllocated}/{perf.totalAvailable}&nbsp;
        </div>
        <div>
          <FormInputButton className='ml-4' icon={faPencil} onClick={() => setAvailableSeatsModalOpen(true)} text={'Edit'} />
          {availableSeatsModalOpen && (
            <AvailableSeatsEditor
              open={availableSeatsModalOpen}
              triggerClose={triggerClose}
              perfId={perf.info.Id}
              seatsAllocated={perf.totalAllocated}
              seatsAvailable={perf.totalAvailable}
            />)}
        </div>
      </div>
      { perf.totalAvailable > 0 && (
        <>
          <div className="flex justify-between pb-4">
            <h3 className='text-xl mt-2'>Allocated Seats</h3>
            <FormInputButton text="Add Allocations" 
              onClick={() => createAllocatedSeat(perf.availableCompId)}
              disabled={max === 0}
              icon={faPlus}/>
            {allocatedSeatsModalOpen && (
              <AllocatedSeatsEditor open={allocatedSeatsModalOpen}
                max={max}
                triggerClose={triggerClose}
                allocatedSeat={allocatedSeatsEditing}
              />)}
          </div>
          { perf.allocated.length === 0 && (<NoDataWarning message="No seats allocated" />) }
          { perf.allocated.length > 0 && (
            <Table className='mb-8'>
              <Table.HeaderRow>
                <Table.HeaderCell>
                  Arranged
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Requested
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Comments
                </Table.HeaderCell>
                <Table.HeaderCell >
                  Seats
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Allocated
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Name / Email
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Venue Confirmation Notes
                </Table.HeaderCell>
              </Table.HeaderRow>
              <Table.Body>
                {perf.allocated.map((as) => (
                  <Table.Row key={as.Id} hover onClick={() => editAllocatedSeat(as)}>
                    <Table.Cell>
                      {as.ArrangedBy}
                    </Table.Cell>
                    <Table.Cell>
                      {as.RequestedBy}
                    </Table.Cell>
                    <Table.Cell>
                      {as.Comments}
                    </Table.Cell>
                    <Table.Cell>
                      <b>{as.Seats}</b>
                    </Table.Cell>
                    <Table.Cell>
                      {as.SeatsAllocated}
                    </Table.Cell>
                    <Table.Cell>
                      {as.TicketHolderName}
                      <br />
                      {as.TicketHolderEmail}
                    </Table.Cell>
                    <Table.Cell>
                      {as.VenueConfirmationNotes}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </>
      )}
    </>
  )
}
