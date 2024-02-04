import Layout from 'components/Layout';
// import { useState } from 'react';
import Toolbar from 'components/tasks/toolbar';
import Tasklist from 'components/tasks/TaskList';
// import TaskButtons from 'components/tasks/TaskButtons';
import GlobalToolbar from 'components/toolbar';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionsAndTasks } from 'services/productionService';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ProductionsWithTasks, productionState } from 'state/tasks/productionState';
import { InitialState } from 'lib/recoil';
import { mapToProductionTaskDTO } from 'lib/mappers';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { productionJumpState } from 'state/booking/productionJumpState';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { objectify } from 'radash';
import useTasksFilter from 'hooks/useTasksFilter';
import { ProductionTaskDTO } from 'interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Index = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { selected } = useRecoilValue(productionJumpState);
  const [productionTasks, setProductionTasks] = useRecoilState(productionState);
  const { filteredProductions, onApplyFilters } = useTasksFilter();
  const onTasksChange = (updatedTasks: ProductionTaskDTO[], productionId: number) => {
    const updatedProductionTasks = productionTasks.map((productionTask) => {
      if (productionTask.Id === productionId) {
        return { ...productionTask, Tasks: updatedTasks };
      }
      return productionTask;
    });
    setProductionTasks(updatedProductionTasks);
  };
  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full">
        <div className="flex-col px-12 w-full flex" style={{ minHeight: '60vh' }}>
          <GlobalToolbar productionJump={false} title={'Tasks'} color={'!text-purple-900'}></GlobalToolbar>
          <Toolbar onApplyFilters={onApplyFilters} />
          {filteredProductions.length > 0 ? (
            filteredProductions.map((production) => (
              <div
                key={production.Id}
                className={selected === undefined || selected === production.Id ? 'mb-10' : 'hidden'}
              >
                <h3 className="text-xl font-bold py-4 !text-purple-900">{production.ShowName}</h3>
                <Tasklist
                  className="max-h-[70vh]"
                  tasks={production?.Tasks}
                  onTasksChange={(change) => onTasksChange(change, production.Id)}
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
  const productionJump = await getProductionJumpState(ctx, 'tasks', AccountId);
  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };
  const productionsWithTasks = await getProductionsAndTasks(AccountId, ProductionId);
  const users = await getUsers(AccountId);
  const productions: ProductionsWithTasks[] = productionsWithTasks.map((t: any) => ({
    Id: t.Id,
    ShowName: t.Show.Name,
    ShowCode: t.Show.Code,
    ShowId: t.Show.Id,
    Code: t.Code,
    Tasks: t.ProductionTask.map(mapToProductionTaskDTO)
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
      productionJump,
    },
    tasks: { productions, bulkSelection: {} },
    account: { user: { users: objectify(users, (user) => user.Id) } },
  };
  return { props: { initialState } };
};

export default Index;
