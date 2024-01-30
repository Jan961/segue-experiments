import BookingSchedule from './modal/BookingSchedule';
import ScheduleReport from './modal/ScheduleReport';
import Barring from './modal/barring';
import Report from './modal/Report';

interface BookingButtonsProps {
  currentProductionId: number;
}

export default function BookingsButtons({ currentProductionId }: BookingButtonsProps) {
  return (
    <>
      <Report ProductionId={currentProductionId}></Report>
      <Barring />
      <BookingSchedule ProductionId={currentProductionId} />
      <ScheduleReport ProductionId={currentProductionId} />
    </>
  );
}
