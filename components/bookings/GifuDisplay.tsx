import { useRecoilValue } from 'recoil'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { venueState } from 'state/booking/venueState'

interface GifuDisplayProps {
  gifuId: number
}

export const GifuDisplay = ({ gifuId }: GifuDisplayProps) => {
  const gifuDict = useRecoilValue(getInFitUpState)
  const venueDict = useRecoilValue(venueState)

  if (!gifuDict) return null

  const g = gifuDict[gifuId]
  const { Name } = venueDict[g.VenueId]

  return (
    <div className="inline-block p-1 px-2 border-l-8 border rounded border-amber-500 bg-amber-100">
      GIFU: { Name }
    </div>
  )
}
