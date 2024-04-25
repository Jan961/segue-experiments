import Layout from 'components/Layout';
import Toolbar from 'components/tasks/toolbar';
import Tasklist from 'components/tasks/TaskList';
import GlobalToolbar from 'components/toolbar';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks, productionState } from 'state/tasks/productionState';
import { InitialState } from 'lib/recoil';
import { mapToProductionTaskDTO } from 'lib/mappers';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { objectify } from 'radash';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import useTasksFilter from 'hooks/useTasksFilter';
import { useRecoilState } from 'recoil';
import { ProductionTaskDTO } from 'interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Index = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions, onApplyFilters } = useTasksFilter();
  const [productionTasks, setProductionTasks] = useRecoilState(productionState);
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
    <Layout title="Tasks | Segue">
      <div className="flex flex-auto w-full h-screen">
        <div className="flex-col px-12 w-full flex" style={{ minHeight: '60vh' }}>
          <GlobalToolbar productionJump={false} title={'Tasks'} color={'!text-purple-900'} />
          <Toolbar onApplyFilters={onApplyFilters} />
          {filteredProductions.length > 0 ? (
            filteredProductions.map((production) => {
              return (
                <div key={production.Id} className="mb-10">
                  <h3 className=" text-xl font-bold py-4 !text-purple-900">{production.ShowName}</h3>
                  <Tasklist
                    onTasksChange={(change) => onTasksChange(change, production.Id)}
                    tasks={production?.Tasks}
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center font-bold text-lg">
              <p>No Tasks Found</p>
            </div>
          )}
          {/* <TaskButtons openBulkModal={openBulkModal} /> */}
        </div>
      </div>
      {/*
        <BulkActionForm
          userAccountId={0}
          closeModal={console.log}
          taskIdArray={isSelectedArray}
          bulkActionField={bulkActionField}
        />
        */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'tasks', AccountId);
  const productionsWithTasks = await getProductionsAndTasks(AccountId);
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
    account: {
      user: { users: objectify(users, (user) => user.Id) },
    },
  };
  return { props: { initialState } };
};

export default Index;
