import { FormInputButton } from 'components/global/forms/FormInputButton'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { getDateBlockId } from './utils/getDateBlockId'
import { viewState } from 'state/booking/viewState'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { dateTypeState } from 'state/booking/dateTypeState'
import { DateTypeDTO } from 'interfaces'
import { CreateOtherParams } from 'pages/api/other/create'
import axios from 'axios'
import { otherState } from 'state/booking/otherState'

interface CreateOtherPanelProps {
  finish: () => void
}

export const CreateOtherPanel = ({ finish }: CreateOtherPanelProps) => {
  const [dateType, setDateType] = React.useState<number>(undefined)
  const [otherDict, setOtherDict] = useRecoilState(otherState)
  const { selectedDate } = useRecoilValue(viewState)
  const schedule = useRecoilValue(scheduleSelector)
  const DateBlockId = getDateBlockId(schedule, selectedDate)
  const dateTypes = useRecoilValue(dateTypeState)

  const createOther = async () => {
    const newOther: CreateOtherParams = { DateBlockId, Date: selectedDate, DateTypeId: dateType }
    const { data } = await axios.post('/api/other/create', newOther)
    const newState = { ...otherDict, [data.Id]: data }
    setOtherDict(newState)
    finish()
  }

  const dayTypeOptions: SelectOption[] = [
    { text: '-- Please Select a Day Type --', value: '' },
    ...dateTypes.map((dt: DateTypeDTO) => ({ text: dt.Name, value: String(dt.Id) })
    )]

  const changeDayType = (e: any) => {
    const { value } = e.target
    if (value) setDateType(parseInt(value))
    else setDateType(undefined)
  }

  return (
    <>
      <h3 className='text-lg mb-2 text-center'>Other</h3>
      <FormInputSelect name="DateType" value={dateType} options={dayTypeOptions} onChange={changeDayType} />
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={finish} text="Cancel" />
        <FormInputButton onClick={createOther} disabled={!dateType} intent="PRIMARY" text="Create" />
      </div>
    </>
  )
}
