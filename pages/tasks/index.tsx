import Layout from 'components/Layout';
import { useState } from 'react';
import Toolbar from 'components/tasks/toolbar';
import Tasklist from 'components/tasks/TaskList';
import TaskButtons from 'components/tasks/TaskButtons';
import GlobalToolbar from 'components/toolbar';
import { GetServerSideProps } from 'next';
import { getToursAndTasks } from 'services/TourService';
import { useRecoilValue } from 'recoil';
import { ToursWithTasks, tourState } from 'state/tasks/tourState';
import { InitialState } from 'lib/recoil';
import { mapToTourTaskDTO } from 'lib/mappers';
import { getAccountIdFromReq } from 'services/userService';

const Index = () => {
  const [bulkIsOpen, setBulkIsOpen] = useState(false);
  const [bulkActionField, setBulkActionField] = useState<string>('');
  const [selectedTour, setSelectedTour] = useState<number | undefined>(undefined);
  const [filteredTasks, setFilteredTasks] = useState<ToursWithTasks[]>([]);

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const handleSearch = (newSearchFilter: string) => {
    setSearchFilter(newSearchFilter);
  };

  const handleStatusChange = (newStatusFilter: string) => {
    setStatusFilter(newStatusFilter);
  };

  const [filters, setFilters] = useState({
    Search: '',
    Tour: undefined,
    Status: statusFilter,
    Assignee: undefined,
  });
  const tours = useRecoilValue(tourState);

  const applyFilters = (filters) => {
    const filteredTours = tours.filter((tour) => {
      // tour filter
      const matchesTour = filters.Tour === undefined || filters.Tour === tour.Id;
      // status filter
      const matchesStatus =
        filters.Status === undefined ||
        (tour.Tasks && tour.Tasks.some((task) => {
          if (filters.Status === 'todo') {
            return task.Progress === 0;
          } else if (filters.Status === 'inProgress') {
            return task.Progress > 0 && task.Progress < 100;
          } else if (filters.Status === 'complete') {
            return task.Progress === 100;
          }
          return false;
        }));

      const matchesAssignee = filters.Assignee === undefined || filters.Assignee === tour.Assignee;
      const matchesSearch =
        filters.Search === '' ||
        (tour.Tasks &&
          tour.Tasks.some((task) => task.TaskName && task.TaskName.toLowerCase().includes(filters.Search.toLowerCase())));

      return matchesTour && matchesStatus && matchesAssignee && matchesSearch;
    });

    setFilteredTasks(filteredTours.length > 0 ? filteredTours : tours);
  };

  const openBulkModal = (key) => {
    switch (key) {
      case 'setstatus':
        setBulkActionField('Status');
        setBulkIsOpen(true);
        break;
      case 'priority':
        setBulkActionField('Priority');
        setBulkIsOpen(true);

        break;
      case 'progress':
        setBulkActionField('Progress');
        setBulkIsOpen(true);

        break;
      case 'followup':
        setBulkActionField('FollowUp');
        setBulkIsOpen(true);

        break;
      case 'reassign':
        setBulkActionField('Assignee');
        setBulkIsOpen(true);

        break;
      default:
        break;
    }
  };

  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full">
        <div className="flex-col px-12 w-full flex" style={{ minHeight: '60vh' }}>
          <GlobalToolbar tourJump={false} title={'Tasks'} color={'text-primary-purple'}>
          </GlobalToolbar>
          <Toolbar setSelectedTour={setSelectedTour} onFilterChange={applyFilters} onSearch={handleSearch} selectedStatus={statusFilter} onStatusChange={handleStatusChange} />
          {filteredTasks.length > 0 ? (
            filteredTasks.map((tour) => (
              <div key={tour.Id} className={selectedTour === undefined || selectedTour == tour.Id ? 'mb-10' : 'hidden'}>
                <h3 className="text-xl font-bold py-4 text-primary-purple">{tour.ShowName}</h3>
                <Tasklist
                  tourId={tour.Id}
                  key={tour.Id}
                  selectedTour={selectedTour}
                  searchFilter={searchFilter}
                  statusFilter={statusFilter}
                  tasks={tour.Tasks || []}
                />
              </div>
            ))
          ) : (
            <div className="text-center font-bold text-lg">
              <p>No Tasks Found</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-end px-12 pb-12">
      <TaskButtons openBulkModal={openBulkModal} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);

  const toursWithTasks = await getToursAndTasks(AccountId);

  const tours: ToursWithTasks[] = toursWithTasks.map((t: any) => ({
    Id: t.Id,
    ShowName: t.Show.Name,
    ShowCode: t.Show.Code,
    ShowId: t.Show.Id,
    Code: t.Code,
    Tasks: t.TourTask.map(mapToTourTaskDTO),
  }));

  const initialState: InitialState = { tasks: { tours, bulkSelection: {} } };
  return { props: { initialState } };
};

export default Index;
