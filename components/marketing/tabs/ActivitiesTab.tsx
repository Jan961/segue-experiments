import * as React from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'components/global/table/Table'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import axios from 'axios'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { LoadingTab } from './LoadingTab'
import { useRecoilValue } from 'recoil'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'
import { ActivitiesResponse } from 'pages/api/marketing/activities/[BookingId]'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { ActivitiesEditor } from '../editors/ActivitiesEditor'
import { objectify } from 'radash'
import { dateToSimple } from 'services/dateService'
import { NoDataWarning } from '../NoDataWarning'

export const ActivitiesTab = () => {
  const { selected } = useRecoilValue(bookingJumpState)

  const [data, setData] = React.useState<Partial<ActivitiesResponse>>({})
  const [loading, setLoading] = React.useState(true)
  const [inputs, setInputs] = React.useState(undefined)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(undefined)
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const search = async () => {
    setLoading(true)
    const { data } = await axios.get(`/api/marketing/activities/${selected}`)
    setData(data)
    setInputs(data.info)
    setLoading(false)
  }

  const create = () => {
    setEditing({ CompanyCost: 0, VenueCost: 0, BookingId: selected, Date: '' })
    setModalOpen(true)
  }

  const edit = (activity: any) => {
    setEditing(activity)
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

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ submitted: false, submitting: true })

    try {
      await axios.post('/api/marketing/activities/booking/update', { ...inputs, Id: selected })
    } catch {
      setStatus({ submitted: false, submitting: false })
    }
    setStatus({ submitted: true, submitting: false })
  }

  const handleOnChange = async (e: any) => {
    const { id, value } = e.target

    setInputs((prev) => ({
      ...prev,
      [id]: value
    }))

    setStatus({
      submitted: false,
      submitting: false
    })
  }

  const activityDict = objectify(data.activityTypes, (x) => x.Id)

  return (
    <>
      <h3 className="text-lg mb-2">Booking Info</h3>
      <form className="bg-gray-200 mb-4 p-4 pb-2 rounded-lg">
        <div className="lg:flex lg:justify-between">
          <FormInputCheckbox
            name="IsOnSale"
            label="On Sale"
            value={inputs.IsOnSale}
            onChange={handleOnChange}/>
          <FormInputDate
            inline
            name="OnSaleDate"
            label="On Sale Date"
            value={inputs.OnSaleDate}
            onChange={handleOnChange} />
          <FormInputCheckbox
            name="MarketingPlanReceived"
            label="Marketing Plans Received"
            value={inputs.MarketingPlanReceived}
            onChange={handleOnChange} />
          <FormInputCheckbox
            name="PrintReqsReceived"
            label="Print Reqs Received"
            value={inputs.PrintReqsReceived}
            onChange={handleOnChange} />
          <FormInputCheckbox
            name="ContactInfoReceived"
            label="Contact Info Received"
            value={inputs.ContactInfoReceived}
            onChange={handleOnChange} />
        </div>
        <div className="text-right mb-2">
          <FormInputButton
            submit
            intent='PRIMARY'
            onClick={handleOnSubmit}
            disabled={status.submitted || status.submitting}
            text="Save Changes" />
        </div>
      </form>
      <div className='flex justify-between pb-4'>
        <h3 className="text-lg">Activities</h3>
        <FormInputButton text="Add New Activity" onClick={create} icon={faPlus}/>
        {modalOpen && <ActivitiesEditor types={data.activityTypes} open={modalOpen} triggerClose={triggerClose} activity={editing} />}

      </div>
      { data.activities.length === 0 && (<NoDataWarning message="No activities recorded" />) }
      { data.activities.length > 0 && (
        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>
            Activity Name
            </Table.HeaderCell>
            <Table.HeaderCell>
            Type
            </Table.HeaderCell>
            <Table.HeaderCell>
            Date
            </Table.HeaderCell>
            <Table.HeaderCell>
            Follow Up Req.
            </Table.HeaderCell>
            <Table.HeaderCell>
            Company Cost
            </Table.HeaderCell>
            <Table.HeaderCell className="w-1/2">
            Venue Cost
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {data.activities.map((activity) => (
              <Table.Row hover key={activity.Id} onClick={() => edit(activity)}>
                <Table.Cell>
                  {activity.Name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {activityDict[activity.ActivityTypeId].Name}
                </Table.Cell>
                <Table.Cell>
                  {dateToSimple(activity.Date)}
                </Table.Cell>
                <Table.Cell className='text-center'>
                  {activity.FollowUpRequired ? 'Yes' : 'No'}
                </Table.Cell>
                <Table.Cell>
                  {activity.CompanyCost ? `£${activity.CompanyCost}` : ''}
                </Table.Cell>
                <Table.Cell>
                  {activity.VenueCost ? `£${activity.VenueCost}` : ''}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  )
}
