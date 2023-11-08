import { useRecoilValue } from 'recoil';
import { viewState } from 'state/booking/viewState';
import { BookingPanel } from './panel/BookingPanel';
import { RehearsalPanel } from './panel/RehearsalPanel';
import { GifuPanel } from './panel/GifuPanel';
import { OtherPanel } from './panel/OtherPanel';
import { scheduleDictSelector } from 'state/booking/selectors/scheduleDictSelector';
import { PerformancePanel } from './panel/PerformancePanel';
import classNames from 'classnames';
import { performanceState } from 'state/booking/performanceState';
import { NewPerformanceButton } from './panel/components/NewPerformanceButton';
import { CreateModal } from './modal/CreateModal';

export const InfoPanel = () => {
  const view = useRecoilValue(viewState);
  const scheduleDict = useRecoilValue(scheduleDictSelector);
  const perfState = useRecoilValue(performanceState);

  const type = view.selected?.type;
  const id = view.selected?.id;

  const baseClass = 'bg-white shadow-xl';

  let panel: any;
  let headerClass = 'm-0 p-2';
  let headerText = '';
  const performanceIds = [];

  if (type === 'booking') {
    panel = <BookingPanel key={id} bookingId={id} />;
    headerClass = classNames(headerClass, 'bg-gray-300');
    headerText = 'Booking';
    const ids = scheduleDict[view.selectedDate]?.PerformanceIds;
    for (const perfId of ids) {
      if (perfState[perfId]?.BookingId === id) performanceIds.push(perfId);
    }
  }
  if (type === 'rehearsal') {
    panel = <RehearsalPanel key={id} rehearsalId={id} />;
    headerText = 'Rehearsal';
    headerClass = classNames(headerClass, 'bg-red-500 text-white');
  }
  if (type === 'gifu') {
    panel = <GifuPanel key={id} gifuId={id} />;
    headerText = 'Get-In Fit-Up';
    headerClass = classNames(headerClass, 'bg-yellow-400');
  }
  if (type === 'other') {
    panel = <OtherPanel key={id} otherId={id} />;
    headerText = 'Other';
    headerClass = classNames(headerClass, 'bg-lime-400');
  }

  if (panel) {
    return (
      <>
        <div className={baseClass}>
          <h2 className={headerClass}>{headerText}</h2>
          <div className="p-2">{panel}</div>
        </div>
        {type === 'booking' && (
          <div className="border-t border-gray-200 p-2 bg-white">
            <h2 className="mb-2">Performances</h2>
            {performanceIds.map((p) => (
              <PerformancePanel key={p} performanceId={p} />
            ))}
            <NewPerformanceButton bookingId={id} />
          </div>
        )}
        <div className="mt-2">
          <CreateModal date={view.selectedDate} />
        </div>
      </>
    );
  }

  return null;
};
