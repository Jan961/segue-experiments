import React from 'react'
import { Tour } from 'interfaces'
import NewTaskForm from './NewTaskForm'
import { ToolbarButton } from 'components/bookings/ToolbarButton'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'

interface ToolbarProps {
  tours:Tour[];
}

const Toolbar: React.FC<ToolbarProps> = ({ tours }: ToolbarProps) => {
  const [addTaskOpen, setAddTaskOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({ Search: '', Tour: undefined })
  const [addRecurringTaskOpen, setAddRecurringTaskOpen] = React.useState(false)

  const handleOnChange = (e) => {
    e.persist()

    setFilters((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const tourOptions = tours.map((x) => ({ text: `${x.Show.Code}/${x.Code}`, value: x.TourId }))

  return (
    <div>
      <div className="flex flex-row gap-2 mb-2 justify-end">
        <ToolbarButton onClick={() => setAddTaskOpen(true)}>Add Task</ToolbarButton>
        { addTaskOpen && (<NewTaskForm open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} tours={tours} />)}
        <ToolbarButton onClick={() => setAddRecurringTaskOpen(true)}>Add Recurring Task</ToolbarButton>
        { addRecurringTaskOpen && (<NewTaskForm recurring open={addRecurringTaskOpen} triggerClose={() => setAddRecurringTaskOpen(false)} tours={tours} />)}
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <FormInputText placeholder="Search" onChange={handleOnChange} name="Search" value={filters.Search}/>
        <FormInputSelect onChange={handleOnChange} name="Tour" value={filters.Tour} options={tourOptions}/>
      </div>
    </div>
  )
}

export default Toolbar
