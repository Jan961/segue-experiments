import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { FormInputText } from 'components/global/forms/FormInputText'
import { RehearsalDTO } from 'interfaces'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { rehearsalDictSelector } from 'state/booking/selectors/rehearsalDictSelector'
import { viewState } from 'state/booking/viewState'

const DEFAULTSTATE: RehearsalDTO = {
  Id: undefined,
  Date: new Date().toISOString().split('T')[0],
  Town: ''
}

export const RehearsalPanel = () => {
  const [inputs, setInputs] = React.useState<RehearsalDTO>(DEFAULTSTATE)
  const { selectedRehearsal } = useRecoilValue(viewState)
  const [status, setStatus] = React.useState({ loading: false, changed: false })
  const [rehearsalDict, addRehearsal] = useRecoilState(rehearsalDictSelector)

  React.useEffect(() => {
    if (selectedRehearsal) {
      setInputs(rehearsalDict[selectedRehearsal])
      setStatus({ changed: false, loading: false })
    } else {
      setInputs(DEFAULTSTATE)
    }
  }, [selectedRehearsal, rehearsalDict])

  const handleOnChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setStatus({ changed: true, loading: false })
  }

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ changed: true, loading: true })
    try {
      const { data } = await axios.post('/api/bookings/update/rehearsal', inputs)
      addRehearsal(data)
      setStatus({ changed: false, loading: false })
    } catch {
      setStatus({ changed: true, loading: false })
    }
  }

  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]

  return (
    <form onSubmit={handleOnSubmit}>
      <h3 className="mb-4 text-lg font-bold">Rehearsal</h3>
      <FormInputText value={inputs.Town} name="Town" label="Town" onChange={handleOnChange}/>
      <FormInputSelect
        value={inputs.StatusCode}
        onChange={handleOnChange}
        options={statusOptions}
        name="StatusCode"
        label="Status"
      />
      <div className="text-right">
        <FormInputButton loading={status.loading} disabled={!status.changed} submit text="Save Changes"/>
      </div>
    </form>
  )
}
