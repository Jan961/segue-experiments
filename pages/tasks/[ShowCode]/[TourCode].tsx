import Layout from 'components/Layout';
// import { useState } from 'react';
import Toolbar from 'components/tasks/toolbar';
import Tasklist from 'components/tasks/TaskList';
// import TaskButtons from 'components/tasks/TaskButtons';
import GlobalToolbar from 'components/toolbar';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToursAndTasks } from 'services/TourService';
import { useRecoilValue } from 'recoil';
import { ToursWithTasks } from 'state/tasks/tourState';
import { InitialState } from 'lib/recoil';
import { mapToTourTaskDTO } from 'lib/mappers';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { tourJumpState } from 'state/booking/tourJumpState';
import { getTourJumpState } from 'utils/getTourJumpState';
import { objectify } from 'radash';
import useTasksFilter from 'hooks/useTasksFilter';

const Index = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { selected } = useRecoilValue(tourJumpState);
  const {filteredTours, onApplyFilters} = useTasksFilter();

  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full">
        <div className="flex-col px-12 w-full flex" style={{ minHeight: '60vh' }}>
          <GlobalToolbar tourJump={false} title={'Tasks'} color={'text-primary-purple'}></GlobalToolbar>
          <Toolbar onApplyFilters={onApplyFilters} />
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => (
              <div
                key={tour.Id}
                className={selected === undefined || selected === tour.Id ? 'mb-10' : 'hidden'}
              >
                <h3 className="text-xl font-bold py-4 text-primary-purple">{tour.ShowName}</h3>
                <Tasklist
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
        {/* <TaskButtons openBulkModal={openBulkModal} /> */}
      </div>
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
    Tasks: t.TourTask.map(mapToTourTaskDTO),
    weekNumToDateMap: t.WeekNumToDateMap
  }));
  const initialState: InitialState = {
    global: {
      tourJump,
    },
    tasks: { tours, bulkSelection: {} },
    account: { user: { users: objectify(users, user=>user.Id) } },
  };
  return { props: { initialState } };
};

export default Index;
