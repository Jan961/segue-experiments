import axios from 'axios'
import { DeleteConfirmation } from 'components/global/DeleteConfirmation'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { GetInFitUpDTO } from 'interfaces'
import { omit } from 'radash'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { sortedGifuSelector } from 'state/booking/selectors/sortedGifuSelector'
import { viewState } from 'state/booking/viewState'
import { getNextId } from './utils/getNextId'
import { VenueSelector } from './components/VenueSelector'

interface GifuPanelProps {
  gifuId: number
}

export const GifuPanel = ({ gifuId }: GifuPanelProps) => {
  const [deleting, setDeleting] = React.useState(false)
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false })
  const setView = useSetRecoilState(viewState)
  const [gifuDict, setGifuDict] = useRecoilState(getInFitUpState)
  const gifu = gifuDict[gifuId]
  const [inputs, setInputs] = React.useState<GetInFitUpDTO>(gifu)
  const sorted = useRecoilValue(sortedGifuSelector)

  const nextId = getNextId(sorted, gifuId)

  const handleOnChange = (id:string, value:any) => {
    if (id === 'VenueId') value = parseInt(value)
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
      const { data } = await axios.post('/api/gifu/update', inputs)
      data.VenueId = parseInt(data.VenueId)
      const replacement = { ...gifuDict, [data.Id]: data }
      setGifuDict(replacement)
      setStatus({ changed: false, submitting: false })
    } catch {
      setStatus({ changed: true, submitting: false })
    }
  }

  const saveAndNext = async (e: any) => {
    e.preventDefault()
    if (changed) await save(e)
    const nextGifu = gifuDict[nextId]
    setView({ selectedDate: nextGifu.Date.split('T')[0], selected: { type: 'rehearsal', id: nextId } })
  }

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
    await axios.post('/api/gifu/delete', { ...gifu })
    const newState = omit(gifuDict, [gifuId])
    setView({ selectedDate: undefined, selected: undefined })
    setGifuDict(newState)
  }

  return (
    <>
      { deleting && (
        <DeleteConfirmation
          title="Delete Get-In Fit-Up"
          onCancel={() => setDeleting(false)}
          onConfirm={performDelete}>
          <p>This will delete the event permanently</p>
        </DeleteConfirmation>
      )}
      <VenueSelector venueId={inputs.VenueId} onChange={(value:any) => handleOnChange('VenueId', value)} />
      <FormInputSelect inline
        value={inputs.StatusCode}
        onChange={(e:any) => handleOnChange('StatusCode', e.target.value)}
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
            disabled={submitting || !nextId}
          />
        </div>
      </div>
    </>
  )
}
