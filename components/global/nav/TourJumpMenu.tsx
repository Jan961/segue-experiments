import { useRouter } from 'next/router'
import { first } from 'radash'
import { useRecoilState } from 'recoil'
import { tourJumpState } from 'state/booking/tourJumpState'

export default function TourJumpMenu () {
  const router = useRouter()
  const [tourJump, setTourJump] = useRecoilState(tourJumpState)

  if (!tourJump?.selected || !tourJump?.tours?.length) return null

  const { tours, selected, path } = tourJump
  function goToTour (e: any) {
    const showCode = first(tours)?.ShowCode
    if (!showCode) return

    const { value } = e.target
    setTourJump({ ...tourJump, loading: true, selected: value })
    router.push(`/${path}/${showCode}/${value}`)
  }

  return (

    <select onChange={goToTour}
      id="selectedTour"
      value={selected}
      className={'text-primary-blue border-y-0 border-r-0 border-l-1 border-gray-200 font-medium rounded-r-md'}
    >
      {tours.map((tour) => (
        <option
          key={`${tour.ShowCode}/${tour.Code}`}
          value={tour.Code}>
          {tour.ShowCode}/{tour.Code}
        </option>
      ))
      }
    </select>
  )
}
