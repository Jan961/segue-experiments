import { exportMasterTasksReport, exportProductionTasksReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { tasksfilterState } from 'state/tasks/tasksFilterState';

interface TaskReportsProps {
  visible: boolean;
  onClose: () => void;
  canExportProductionTasks?: boolean;
  canExportMasterTasks?: boolean;
}

const TaskReports = ({ visible, onClose, canExportProductionTasks, canExportMasterTasks }: TaskReportsProps) => {
  const filters = useRecoilValue(tasksfilterState);
  const { selected } = useRecoilValue(productionJumpState);

  const exportTasks = async () => {
    notify.promise(exportProductionTasksReport(filters, selected), {
      loading: 'Generating Production Tasks Report',
      success: 'Production Tasks Report successfully downloaded',
      error: 'Error generating Production Tasks Report',
    });
  };
  const exportMasterTasks = async () => {
    notify.promise(exportMasterTasksReport(), {
      loading: 'Generating Production Tasks Report',
      success: 'Production Tasks Report successfully downloaded',
      error: 'Error generating Production Tasks Report',
    });
  };
  return (
    <PopupModal show={visible} onClose={onClose} title="Task Reports" titleClass="text-primary-navy text-xl mb-2">
      <div className="flex mt-2 flex-col">
        <Button
          text="Production Task List"
          className="w-[262px] mb-3"
          sufixIconName="excel"
          onClick={exportTasks}
          disabled={canExportProductionTasks}
        />
        <Button
          text="Master Task List"
          className="w-[262px]"
          sufixIconName="excel"
          onClick={exportMasterTasks}
          disabled={canExportMasterTasks}
        />
      </div>
    </PopupModal>
  );
};

export default TaskReports;
