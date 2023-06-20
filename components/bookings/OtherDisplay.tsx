import { first } from 'radash'
import { useRecoilValue } from 'recoil'
import { dateTypeState } from 'state/booking/dateTypeState'
import { otherState } from 'state/booking/otherState'

interface OtherDisplayProps {
  otherId: number
}

export const OtherDisplay = ({ otherId }: OtherDisplayProps) => {
  const otherDict = useRecoilValue(otherState)
  const dayTypeArray = useRecoilValue(dateTypeState)

  if (!otherDict) return null

  const o = otherDict[otherId]
  const match = first(dayTypeArray.filter(dt => o.DateTypeId === dt.Id))

  return (
    <div className="inline-block p-1 px-2 border-l-8 border rounded border-lime-500 bg-lime-100">
      Other: { match?.Name }
    </div>
  )
}
