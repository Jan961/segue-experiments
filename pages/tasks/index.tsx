import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import Filters from 'components/tasks2/Filters';
import TasksTable from 'components/tasks2/TasksTable';
import useTasksFilter from 'hooks/useTasksFilter';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks, productionState } from 'state/tasks/productionState';
import { mapToProductionTaskDTO } from 'lib/mappers';
import { objectify } from 'radash';
import { useRecoilState } from 'recoil';
import { ProductionTaskDTO } from 'interfaces';

const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters onApplyFilters={onApplyFilters} />
      </div>
      {filteredProductions.map((production) => {
        return (
          <div key={production.Id} className="mb-10">
            <h3 className=" text-xl font-bold py-4 !text-purple-900">{production.ShowName}</h3>
            <TasksTable
              rowData={production?.Tasks}
            />
          </div>
        );
      })}
    </Layout>
  );
};

export default TasksPage;

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
