import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'
import { RehearsalPanel } from './panel/RehearsalPanel'

export const InfoPanel = () => {
  const view = useRecoilValue(viewState)
  const { selectedBooking, selectedRehearsal } = view

  return (
    <div className="w-6/12 pl-4" >
      { selectedBooking && <BookingPanel />}
      { selectedRehearsal && <RehearsalPanel />}
    </div>
  )
}
