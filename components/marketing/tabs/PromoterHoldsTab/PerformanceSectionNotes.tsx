import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { AvailableSeatsEditor } from 'components/marketing/editors/AvailableSeatsEditor';
import { useState } from 'react';
import { dateToSimple, getTimeFromDateAndTime } from 'services/dateService';

interface PerformanceSectionProps {
  perf: any;
  triggerSearch: () => void;
  onCreate: (Id: string, max: number) => void;
}

export const PerformanceSectionNotes = ({ perf, triggerSearch, onCreate }: PerformanceSectionProps) => {
  const [availableSeatsModalOpen, setAvailableSeatsModalOpen] = useState<boolean>(false);
  const max = perf.totalAvailable - perf.totalAllocated;
  const triggerClose = async (refresh: boolean) => {
    setAvailableSeatsModalOpen(false);
    if (refresh) await triggerSearch();
  };

  const overBooked = perf.totalAllocated > perf.totalAvailable;

  return (
    <>
      <div className="grid grid-cols-12 gap-4 mb-4 py-2">
        <div className="col-span-11 bg-white text-sm text-gray-500 rounded p-3 border-2 ">
          <div className="text-md mb-2">
            <h2 className="font-bold mr-4">
              <span className="mr-1">{dateToSimple(perf.info.Date)}</span>
              <span>{getTimeFromDateAndTime(perf.info.Date)}</span>
              <span className="ml-3 mr-1">Seats Allocated:</span>
              <span className={overBooked ? 'text-red-600' : ''}>
                {perf.totalAllocated}/{perf.totalAvailable}&nbsp;
              </span>
            </h2>
          </div>
          {perf.note || 'N/A'}
        </div>

        <div className="flex flex-col items-end">
          <FormInputButton className="mb-2" onClick={() => onCreate(perf.availableCompId, max)} icon={faPlus} />
          <FormInputButton intent="PRIMARY" icon={faPencil} onClick={() => setAvailableSeatsModalOpen(true)} />
        </div>
      </div>

      {availableSeatsModalOpen && (
        <AvailableSeatsEditor
          open={availableSeatsModalOpen}
          triggerClose={triggerClose}
          perfId={perf.info.Id}
          note={perf.note}
          seatsAllocated={perf.totalAllocated}
          seatsAvailable={perf.totalAvailable}
        />
      )}
    </>
  );
};
