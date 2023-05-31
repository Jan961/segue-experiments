import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'

export const InfoPanel = () => {
  const view = useRecoilValue(viewState)
  const { selectedBooking } = view

  return (
    <div className="w-6/12 pl-4" >
      { selectedBooking && <BookingPanel />}
    </div>
  )
}
