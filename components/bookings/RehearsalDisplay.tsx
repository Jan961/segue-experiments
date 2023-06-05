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
    <>
      { r.Town ? r.Town : 'N/A' }
      <br />
      <span className="inline-block px-2 rounded bg-red-500 text-white">
        Rehearsal
      </span>
    </>
  )
}
