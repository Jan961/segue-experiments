import { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { tourState } from 'state/tasks/tourState';
import { applyTaskFilters, filterTourTasksBySearchText } from 'utils/tasks';

const useTasksFilter = () => {
    const tours = useRecoilValue(tourState);
    const filters = useRecoilValue(tasksfilterState);
    const [filteredTours, setFilteredTours] = useState(tours)
    const handleSearch=(e: ChangeEvent<HTMLInputElement>)=>{
      const updatedTours = filterTourTasksBySearchText(tours, e.target.value);
      setFilteredTours(updatedTours);
    }
    const onApplyFilters=()=>{
      const updatedTours = applyTaskFilters(tours,  filters)
      setFilteredTours(updatedTours)
    }
    
  return {filteredTours, handleSearch, onApplyFilters};
};

export default useTasksFilter;