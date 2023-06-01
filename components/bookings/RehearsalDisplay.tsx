import { useRecoilValue, useSetRecoilState } from 'recoil'
import { rehearsalDictSelector } from 'state/booking/selectors/rehearsalDictSelector'
import { viewState } from 'state/booking/viewState'

interface RehearsalDisplayProps {
  rehearsalId: number
}

export const RehearsalDisplay = ({ rehearsalId }: RehearsalDisplayProps) => {
  const rehearsalDict = useRecoilValue(rehearsalDictSelector)
  const setView = useSetRecoilState(viewState)

  if (!rehearsalId) return null

  const r = rehearsalDict[rehearsalId]

  const selectRehearsal = (e: any) => {
    e.stopPropagation()
    setView({ selectedRehearsal: rehearsalId, selectedDate: r.Date.split('T')[0] })
  }

  return (
    <span
      className="inline-block px-2 rounded bg-red-500 hover:bg-red-400 text-white cursor-pointer"
      onClick={selectRehearsal}
    >
      { r.Town ? r.Town : 'Rehearsal' }
    </span>
  )
}
