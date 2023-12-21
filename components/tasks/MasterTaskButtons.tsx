import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import MasterTaskEditor from './editors/MasterTaskEditor';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';

function TaskButtons() {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [filter, setFilter] = useRecoilState(filterState);
  const onSearch = useCallback(
    (e) => {
      setSearch(e?.target?.value);
      setFilter({ ...filter, masterTaskText: e?.target?.value });
    },
    [filter, setFilter],
  );

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <ToolbarButton className="text-purple-900" onClick={() => setModalOpen(true)}>
            Add New
          </ToolbarButton>
          <ToolbarButton className="text-purple-900">Export</ToolbarButton>
        </div>
        <div>
          <FormInputText value={search} name={'Search'} placeholder="Search Master Tasks.." onChange={onSearch} />
        </div>
      </div>
      {modalOpen && <MasterTaskEditor open={modalOpen} triggerClose={() => setModalOpen(false)} />}
    </>
  );
}

export default TaskButtons;
