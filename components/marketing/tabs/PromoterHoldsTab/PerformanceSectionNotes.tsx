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
      <div className="flex w-full mb-4  ">
        <div className="w-full bg-white text-sm text-gray-500 rounded p-3 border-2 ">
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

        <div className="w-8 ml-4 flex flex-col justify-center items-center">
          <FormInputButton
            className="mb-2"
            onClick={() => onCreate(perf.availableCompId, max)}
            icon={faPlus}
            tooltip="Add seats"
          />
          <FormInputButton
            intent="PRIMARY"
            icon={faPencil}
            onClick={() => setAvailableSeatsModalOpen(true)}
            tooltip="Edit notes/seats"
          />
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
