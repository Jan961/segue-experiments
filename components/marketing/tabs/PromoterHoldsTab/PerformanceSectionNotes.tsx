import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { AvailableSeatsEditor } from 'components/marketing/editors/AvailableSeatsEditor';
import { useState } from 'react';
import { dateToSimple, getTimeFromDateAndTime } from 'services/dateService';

interface PerformanceSectionProps {
  perf: any;
  triggerSearch: () => void;
}

export const PerformanceSectionNotes = ({ perf, triggerSearch }: PerformanceSectionProps) => {
  const [availableSeatsModalOpen, setAvailableSeatsModalOpen] = useState<boolean>(false);

  const triggerClose = async (refresh: boolean) => {
    setAvailableSeatsModalOpen(false);
    if (refresh) await triggerSearch();
  };

  const overBooked = perf.totalAllocated > perf.totalAvailable;

  return (
    <>
      <div className="flex my-2 justify-between items-center">
        <div className="text-md">
          <h2 className="font-bold mr-4">
            <span className="mr-4">{dateToSimple(perf.info.Date)}</span>
            <span>{getTimeFromDateAndTime(perf.info.Date)}</span>
          </h2>
          Seats Allocated:&nbsp;
          <span className={overBooked ? 'text-red-600' : ''}>
            {perf.totalAllocated}/{perf.totalAvailable}&nbsp;
          </span>
        </div>

        <div>
          <FormInputButton
            intent="PRIMARY"
            className="ml-4"
            icon={faPencil}
            onClick={() => setAvailableSeatsModalOpen(true)}
            text="Edit Availability/Notes"
          />
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
        </div>
      </div>
      <div className="bg-white text-sm text-gray-500 rounded p-2">
        <h3 className="font-bold pb-4">Notes</h3>
        {perf.note || 'N/A'}
      </div>
    </>
  );
};
