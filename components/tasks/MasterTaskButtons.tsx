import { ToolbarButton } from "components/bookings/ToolbarButton";
import { FormInputText } from "components/global/forms/FormInputText";
import MasterTaskEditor from "./editors/MasterTaskEditor";
import React from "react";

function TaskButtons() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState('')

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <ToolbarButton className="text-purple-900" onClick={()=>setModalOpen(true)}>Add New</ToolbarButton>
          <ToolbarButton className="text-purple-900">Export</ToolbarButton>
        </div>
        <div>
          <FormInputText value={search} name={"Search"} placeholder="Search Master Tasks by Name" onChange={(e)=>setSearch(e?.target?.value)} />
        </div>
      </div>
      {modalOpen && <MasterTaskEditor open={modalOpen} triggerClose={() => setModalOpen(false)} />}
    </>
  );
}

export default TaskButtons;
