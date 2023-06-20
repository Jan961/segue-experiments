import axios from 'axios'
import { DeleteConfirmation } from 'components/global/DeleteConfirmation'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { OtherDTO } from 'interfaces'
import { omit } from 'radash'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { otherState } from 'state/booking/otherState'
import { dateTypeState } from 'state/booking/dateTypeState'

interface OtherPanelProps {
  otherId: number
}

export const OtherPanel = ({ otherId }: OtherPanelProps) => {
  const [deleting, setDeleting] = React.useState(false)
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false })
  const [otherDict, setOtherDict] = useRecoilState(otherState)
  const dateTypes = useRecoilValue(dateTypeState)
  const other = otherDict[otherId]
  const [inputs, setInputs] = React.useState<OtherDTO>(other)

  const handleOnChange = (e: any) => {
    let { id, value } = e.target
    if (id === 'DateTypeId') value = parseInt(value)
    setInputs((prev) => ({
      ...prev,
      [id]: value
    }))
    setStatus({ changed: true, submitting: false })
  }

  const save = async (e: any) => {
    e.preventDefault()
    setStatus({ changed: true, submitting: true })
    try {
      const { data } = await axios.post('/api/other/update', inputs)
      const replacement = { ...otherDict, [data.Id]: data }
      setOtherDict(replacement)
      setStatus({ changed: false, submitting: false })
    } catch {
      setStatus({ changed: true, submitting: false })
    }
  }

  const dateTypeOptions: SelectOption[] = dateTypes.map(x => ({ value: x.Id.toString(), text: x.Name }))

  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]

  const initiateDelete = async () => {
    setDeleting(true)
  }

  const performDelete = async () => {
    setDeleting(false)
    await axios.post('/api/other/delete', { ...other })
    const newState = omit(otherDict, [otherId])
    setOtherDict(newState)
  }

  return (
    <>
      { deleting && (
        <DeleteConfirmation
          title="Delete Other"
          onCancel={() => setDeleting(false)}
          onConfirm={performDelete}>
          <p>This will delete the event permanently</p>
        </DeleteConfirmation>
      )}
      <FormInputSelect
        value={inputs.DateTypeId}
        onChange={handleOnChange}
        options={dateTypeOptions}
        name="DateTypeId"
        label="Day Type"
      />
      <FormInputSelect inline
        value={inputs.StatusCode}
        onChange={handleOnChange}
        options={statusOptions}
        name="StatusCode"
        label="Status"
      />
      <div className="grid grid-cols-3 gap-2 py-4 pb-0">
        <div>
          <FormInputButton
            className="w-full"
            text="Delete"
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting}
          />
        </div>
        <div className="col-span-2">
          <FormInputButton
            className="rounded-br-none rounded-tr-none w-full border-r border-soft-primary-blue"
            text="Save"
            intent='PRIMARY'
            disabled={submitting || !changed}
            onClick={save}
          />
        </div>
      </div>
    </>
  )
}
