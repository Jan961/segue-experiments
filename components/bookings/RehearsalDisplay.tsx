import { useRecoilValue } from 'recoil'
import { rehearsalDictSelector } from 'state/booking/selectors/rehearsalDictSelector'

interface RehearsalDisplayProps {
  rehearsalId: number
}

export const RehearsalDisplay = ({ rehearsalId }: RehearsalDisplayProps) => {
  const rehearsalDict = useRecoilValue(rehearsalDictSelector)

  if (!rehearsalId) return null

  const r = rehearsalDict[rehearsalId]

  return (
    <div className="inline-block p-1 px-2 shadow-md rounded bg-red-500 text-white">
      Rehearsal: { r.Town ? r.Town : 'N/A' }
    </div>
  )
}
