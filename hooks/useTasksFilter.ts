import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { applyTaskFilters, filterProductionTasksBySearchText } from 'utils/tasks';

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const filters = useRecoilValue(tasksfilterState);
  const [filteredProductions, setFilteredProductions] = useState(productions);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedProductions = filterProductionTasksBySearchText(productions, e.target.value);
    setFilteredProductions(updatedProductions);
  };
  const onApplyFilters = () => {
    const updatedProductions = applyTaskFilters(productions, filters);
    setFilteredProductions(updatedProductions);
  };
  useEffect(() => {
    onApplyFilters();
  }, [productions]);
  return { filteredProductions, handleSearch, onApplyFilters };
};

export default useTasksFilter;
