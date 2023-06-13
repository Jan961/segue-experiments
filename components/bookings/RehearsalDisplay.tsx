import { useRecoilValue } from 'recoil'
import { rehearsalState } from 'state/booking/rehearsalState'

interface RehearsalDisplayProps {
  rehearsalId: number
}

export const RehearsalDisplay = ({ rehearsalId }: RehearsalDisplayProps) => {
  const rehearsalDict = useRecoilValue(rehearsalState)

  if (!rehearsalId) return null

  const r = rehearsalDict[rehearsalId]

  return (
    <div className="inline-block p-1 px-2 rounded border border-l-8 border-red-500 bg-red-200">
      Rehearsal: { r.Town ? r.Town : 'N/A' }
    </div>
  )
}
