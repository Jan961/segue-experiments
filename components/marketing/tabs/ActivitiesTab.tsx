import * as React from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { HardCodedWarning } from '../HardCodedWarning'
import { Table } from 'components/global/table/Table'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import axios from 'axios'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { LoadingTab } from './LoadingTab'
import { useRecoilValue } from 'recoil'

const activities = [
  { Id: 1, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' },
  { Id: 2, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' },
  { Id: 3, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' },
  { Id: 4, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' },
  { Id: 5, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' },
  { Id: 6, activityName: 'hello World!', type: 'Type 1', created: '10/10/2022', followup: '20/12/2022', co: 'cs', venue: 'The kings, Glasgow', notes: 'loripsuim' }
]

export const ActivitiesTab = () => {
  const { selected, bookings } = useRecoilValue(bookingJumpState)

  const [activites, setActivites] = React.useState(undefined)
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(undefined)

  const search = async () => {
    setLoading(true)
    setActivites([])

    const { data } = await axios.get(`/api/marketing/activities/${selected}`)
    setActivites(data)
    setLoading(false)
  }

  const create = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const edit = (vc: any) => {
    console.log(vc)
    setEditing(vc)
    setModalOpen(true)
  }

  React.useEffect(() => {
    search()
  }, [selected])

  const triggerClose = async (refresh: boolean) => {
    if (refresh) await search()
    setModalOpen(false)
  }

  if (loading) return (<LoadingTab />)

  return (
    <>
      <HardCodedWarning />
      <div className={'mb-3'}>
        <form className="grid grid-cols-5">
          <div className="flex flex-row items-center space-x-4 ">
            <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
            <label htmlFor={'onSale'} className={''}>On Sale</label>
          </div>
          <div className="flex flex-row items-center space-x-4 ">

            <label htmlFor={'date'} className={'sr-only'}>Date</label>
            <input className="border border-gray-300  rounded-md" type={'date'} id={'date'} value={new Date().toDateString()} name={'date'}/>
          </div>
          <div className="flex flex-row items-center space-x-4 ">

            <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
            <label htmlFor={'onSale'} className={''}> Marketing Plans Received </label>
          </div>
          <div className="flex flex-row items-center space-x-4 ">

            <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
            <label htmlFor={'onSale'} className={''}> Print requirements received </label>
          </div>
          <div className="flex flex-row items-center space-x-4 ">

            <input type={'checkbox'} className={''} name={'onSale'} value={'off'} />
            <label htmlFor={'onSale'} className={''}> Contact info Received </label>
          </div>

        </form>

      </div>
      <div className='text-right pb-4'>
        <FormInputButton text="Add New Contact" onClick={create} icon={faPlus}/>
      </div>
      <Table>
        <Table.HeaderRow>
          <Table.HeaderCell>
          Activity Name
          </Table.HeaderCell>
          <Table.HeaderCell>
          type
          </Table.HeaderCell>
          <Table.HeaderCell>
          week created / Follow up Date
          </Table.HeaderCell>
          <Table.HeaderCell>
          co
          </Table.HeaderCell>
          <Table.HeaderCell>
          Venue
          </Table.HeaderCell>
          <Table.HeaderCell>
          Notes
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {activities.map((activity, idx) => (
            <Table.Row key={activity.Id} >
              <Table.Cell>
                {activity.activityName}
              </Table.Cell>
              <Table.Cell>
                {activity.type}
              </Table.Cell>
              <Table.Cell>
                {activity.created} - {activity.followup}
              </Table.Cell>
              <Table.Cell>
                {activity.co}
              </Table.Cell>
              <Table.Cell>
                {activity.venue}
              </Table.Cell>
              <Table.Cell>
                {activity.notes}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
