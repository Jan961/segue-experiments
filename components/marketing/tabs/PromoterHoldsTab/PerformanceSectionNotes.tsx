import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { AvailableSeatsEditor } from 'components/marketing/editors/AvailableSeatsEditor';
import React from 'react';
import { dateToSimple, getTimeFromDateAndTime } from 'services/dateService';

interface PerformanceSectionProps {
    perf: any;
    triggerSearch: () => void;
}

export const PerformanceSectionNotes = ({ perf, triggerSearch }: PerformanceSectionProps) => {
    // Allocated Seats
    const [allocatedSeatsModalOpen, setAllocatedSeatsModalOpen] = React.useState(false);
    const [allocatedSeatsEditing, setAllocatedSeatsEditing] = React.useState(undefined);
    const [availableSeatsModalOpen, setAvailableSeatsModalOpen] = React.useState(false);

    const triggerClose = async (refresh: boolean) => {
        setAvailableSeatsModalOpen(false);
        setAllocatedSeatsModalOpen(false);
        if (refresh) await triggerSearch();
    };

    // Allocated Seats
    const createAllocatedSeat = (acId) => {
        setAllocatedSeatsEditing({ AvailableCompId: acId, Seats: 0 });
        setAllocatedSeatsModalOpen(true);
    };

    const editAllocatedSeat = (as: any) => {
        setAllocatedSeatsEditing(as);
        setAllocatedSeatsModalOpen(true);
    };

    console.log('status', perf);
    const max = perf.totalAvailable - perf.totalAllocated;
    const overBooked = perf.totalAllocated > perf.totalAvailable;

    return (
        <>
            <div className="bg-gray-200 rounded p-4 pt-2 mb-4">
                <div className="flex my-2 justify-between items-center">
                    <div className="text-lg">
                        <h2 className="text-lg font-bold mr-4">
                            <span className='mr-4'>{dateToSimple(perf.info.Date)}</span>
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
                <div className="bg-white rounded p-2">
                    <h3 className="text-lg font-bold pb-4">Notes</h3>
                    {perf.note || 'N/A'}
                </div>
            </div>
        </>
    );
};
