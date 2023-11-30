import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

const filters = useRecoilValue(filtersState);
const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

export const filtersState = atom({
  key: 'taskFiltersState',
  default: { Search: '', Tour: undefined, Assignee: 0, AssignedBy: 0 },
});

export const filteredTourState = selector({
  key: 'filteredTourState',
  get: ({ get }) => {
    const tours = get(tourState);
    const filters = get(filtersState);

    if (!filters.Tour && filters.Assignee === 0 && filters.AssignedBy === 0 && filters.Search === '') {
      return tours;
    }

    return tours.map((tour) => {
      const filteredTasks = tour.Tasks.filter((task) => {
        return (
          (!filters.Tour || filters.Tour === 0 || filters.Tour === task.TourId) &&
          (!filters.Assignee || filters.Assignee === 0 || filters.Assignee === task.Assignee) &&
          (!filters.AssignedBy || filters.AssignedBy === 0 || filters.AssignedBy === task.AssignedBy) &&
          (!filters.Search || task.Name.toLowerCase().includes(filters.Search.toLowerCase()))
        );
      });

      return { ...tour, Tasks: filteredTasks };
    });
  },
});

// Define a selector to handle the loading state
export const isLoadingState = atom({
  key: 'taskIsLoadingState',
  default: false,
});

// Modify tourState to use filteredTourState and isLoadingState
export const tourState = atom({
  key: 'taskTourState',
  default: [],
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        // Update the loading state when tourState changes
        const isLoading = newValue.length === 0;
        onSet(isLoadingState, isLoading);
      });
    },
  ],
});

// const applyFilters = () => {
//   setFilters({ Search: 'your_search_value', Tour: 1, Assignee: 2, AssignedBy: 3 });
//   setIsLoading(true);
//   setIsLoading(false);
// };
