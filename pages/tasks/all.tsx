import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import Filters from 'components/tasks/Filters';
import TasksTable from 'components/tasks/TasksTable';
import useTasksFilter from 'hooks/useTasksFilter';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { objectify } from 'radash';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useMemo } from 'react';
import { getColumnDefs } from 'components/tasks/tableConfig';
import { mapToProductionTasksDTO } from 'mappers/tasks';
import { productionJumpState } from 'state/booking/productionJumpState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions } = useTasksFilter();

  const { users } = useRecoilValue(userState);

  const usersList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  const exists = usersList.some((item) => item.text === 'All');

  if (!exists) {
    usersList.unshift({ value: -1, text: 'All' });
  }
  const currentProductionObjList = useRecoilValue(productionJumpState).productions;
  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters usersList={usersList} />
      </div>
      {filteredProductions.length === 0 ? (
        <TasksTable rowData={[]} />
      ) : (
        filteredProductions.map((production) => {
          const columnDefs = getColumnDefs(
            usersList,
            currentProductionObjList.find((item) => item.Id === production.Id),
          );
          return (
            <div key={production.Id} className="mb-10">
              <TasksTable
                tableHeight={filteredProductions.length > 1}
                rowData={production.Tasks}
                columnDefs={columnDefs}
                productionId={production.Id}
              />
            </div>
          );
        })
      )}
    </Layout>
  );
};

export default TasksPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'tasks', AccountId);
  productionJump.selected = -1;
  const users = await getUsers(AccountId);
  const productionsWithTasks = await getProductionsAndTasks(AccountId);

  const productions: ProductionsWithTasks[] = mapToProductionTasksDTO(productionsWithTasks);
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
