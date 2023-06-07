import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { FormInputText } from 'components/global/forms/FormInputText'
import { RehearsalDTO } from 'interfaces'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { rehearsalDictSelector } from 'state/booking/selectors/rehearsalDictSelector'
import { sortedRehearsalSelector } from 'state/booking/selectors/sortedRehearsalSelector'
import { viewState } from 'state/booking/viewState'

const DEFAULTSTATE: RehearsalDTO = {
  Id: undefined,
  Date: new Date().toISOString().split('T')[0],
  Town: ''
}

interface RehearsalPanelProps {
  rehearsalId: number
}

const getNextid = (sortedRehearsal: RehearsalDTO[], current: number) => {
  let found = false

  for (const b of sortedRehearsal) {
    if (found) return b.Id
    if (current === b.Id) found = true
  }
  return undefined
}

export const RehearsalPanel = ({ rehearsalId }: RehearsalPanelProps) => {
  const [inputs, setInputs] = React.useState<RehearsalDTO>(DEFAULTSTATE)
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false })
  const setView = useSetRecoilState(viewState)
  const [rehearsalDict, addRehearsal] = useRecoilState(rehearsalDictSelector)
  const sorted = useRecoilValue(sortedRehearsalSelector)

  const nextRehearsalId = getNextid(sorted, rehearsalId)

  React.useEffect(() => {
    if (rehearsalId) {
      setInputs(rehearsalDict[rehearsalId])
      setStatus({ changed: false, submitting: false })
    } else {
      setInputs(DEFAULTSTATE)
    }
  }, [rehearsalId, rehearsalDict])

  const handleOnChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setStatus({ changed: true, submitting: false })
  }

  const save = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ changed: true, submitting: true })
    try {
      const { data } = await axios.post('/api/bookings/update/rehearsal', inputs)
      addRehearsal(data)
      setStatus({ changed: false, submitting: false })
    } catch {
      setStatus({ changed: true, submitting: false })
    }
  }

  const saveAndNext = async (e: any) => {
    e.preventDefault()
    if (changed) await save(e)
    const nextBooking = rehearsalDict[nextRehearsalId]
    setView({ selectedDate: nextBooking.Date.split('T')[0] })
  }

  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]

  const initiateDelete = () => {
    alert('Not Implimented, but will confirm')
  }

  return (
    <>
      <FormInputText value={inputs.Town} name="Town" label="Town" onChange={handleOnChange}/>
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
        <div className="col-span-2 grid grid-cols-2">
          <FormInputButton
            className="rounded-br-none rounded-tr-none w-full border-r border-soft-primary-blue"
            text="Save"
            intent='PRIMARY'
            disabled={submitting || !changed}
            onClick={save}
          />
          <FormInputButton
            className="rounded-bl-none rounded-tl-none w-full"
            text={!changed ? 'Next' : 'Save & Next'}
            intent='PRIMARY'
            onClick={saveAndNext}
            disabled={submitting || !nextRehearsalId}
          />
        </div>
      </div>
    </>
  )
}
