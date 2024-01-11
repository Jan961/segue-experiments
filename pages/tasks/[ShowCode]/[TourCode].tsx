import Layout from 'components/Layout';
// import { useState } from 'react';
import Toolbar from 'components/tasks/toolbar';
import Tasklist from 'components/tasks/TaskList';
// import TaskButtons from 'components/tasks/TaskButtons';
import GlobalToolbar from 'components/toolbar';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToursAndTasks } from 'services/TourService';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ToursWithTasks, tourState } from 'state/tasks/tourState';
import { InitialState } from 'lib/recoil';
import { mapToTourTaskDTO } from 'lib/mappers';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { tourJumpState } from 'state/booking/tourJumpState';
import { getTourJumpState } from 'utils/getTourJumpState';
import { objectify } from 'radash';
import useTasksFilter from 'hooks/useTasksFilter';
import { TourTaskDTO } from 'interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Index = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { selected } = useRecoilValue(tourJumpState);
  const [tourTasks, setTourTasks] = useRecoilState(tourState);
  const { filteredTours, onApplyFilters } = useTasksFilter();
  const onTasksChange = (updatedTasks: TourTaskDTO[], tourId: number) => {
    const updatedTourTasks = tourTasks.map((tourTask) => {
      if (tourTask.Id === tourId) {
        return { ...tourTask, Tasks: updatedTasks };
      }
      return tourTask;
    });
    setTourTasks(updatedTourTasks);
  };
  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full">
        <div className="flex-col px-12 w-full flex" style={{ minHeight: '60vh' }}>
          <GlobalToolbar tourJump={false} title={'Tasks'} color={'!text-purple-900'}></GlobalToolbar>
          <Toolbar onApplyFilters={onApplyFilters} />
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => (
              <div key={tour.Id} className={selected === undefined || selected === tour.Id ? 'mb-10' : 'hidden'}>
                <h3 className="text-xl font-bold py-4 !text-purple-900">{tour.ShowName}</h3>
                <Tasklist
                  className="max-h-[70vh]"
                  tasks={tour?.Tasks}
                  onTasksChange={(change) => onTasksChange(change, tour.Id)}
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
      <div className="flex w-full justify-end px-12 pb-12">{/* <TaskButtons openBulkModal={openBulkModal} /> */}</div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const tourJump = await getTourJumpState(ctx, 'tasks', AccountId);
  const TourId = tourJump.selected;
  // TourJumpState is checking if it's valid to access by accountId
  if (!TourId) return { notFound: true };
  const toursWithTasks = await getToursAndTasks(AccountId, TourId);
  const users = await getUsers(AccountId);
  const tours: ToursWithTasks[] = toursWithTasks.map((t: any) => ({
    Id: t.Id,
    ShowName: t.Show.Name,
    ShowCode: t.Show.Code,
    ShowId: t.Show.Id,
    Code: t.Code,
    Tasks: t.TourTask.map(mapToTourTaskDTO)
      .map((task) => ({
        ...task,
        StartDate: t.WeekNumToDateMap[task.StartByWeekNum],
        CompleteDate: t.WeekNumToDateMap[task.CompleteByWeekNum],
      }))
      .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum),
    weekNumToDateMap: t.WeekNumToDateMap,
  }));
  const initialState: InitialState = {
    global: {
      tourJump,
    },
    tasks: { tours, bulkSelection: {} },
    account: { user: { users: objectify(users, (user) => user.Id) } },
  };
  return { props: { initialState } };
};

export default Index;