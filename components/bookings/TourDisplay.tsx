import { useRecoilValue } from 'recoil'
import { currentTourSelector } from 'state/booking/selectors/currentTourSelector'

export const TourDisplay = () => {
  const tour = useRecoilValue(currentTourSelector)
  console.log(tour)

  return (
    <div className="hidden xl:block col-span-1 text-center font-bold opacity-50">
      {tour.ShowCode}/{tour.Code}
    </div>
  )
}
