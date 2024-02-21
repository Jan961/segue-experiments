import Barring from './modal/barring';
import Button from 'components/core-ui-lib/Button';
import AddBooking from './modal/NewBooking';
import { useEffect, useState } from 'react';
import { productionJumpState } from 'state/booking/productionJumpState';
import { useRecoilValue } from 'recoil';
import { getProductionById } from 'services/productionService';

export default function BookingsButtons() {
  const [showAddNewBookingModal, setShowAddNewBookingModal] = useState(false);
  const [showBarringModal, setShowBarringModal] = useState(false);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [prodctionItem, setProductionItem] = useState({})

  useEffect(() => {
    
  }, [ProductionId]);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Button text="Create New Booking" className="w-[155px]" onClick={() => setShowAddNewBookingModal(true)}></Button>
      <Button
        text="Booking Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      ></Button>
      <Button text="Venue History" className="w-[155px]"></Button>
     
      <Button text="Barring Check" className="w-[155px]" onClick={() => setShowBarringModal(true)}></Button>

      {showBarringModal && <Barring visible={showBarringModal} onClose={() => setShowBarringModal(false)} />}
      {showAddNewBookingModal && (
        <AddBooking visible={showAddNewBookingModal} onClose={() => setShowAddNewBookingModal(false)} />
      )}

      
    </div>
  );
}
