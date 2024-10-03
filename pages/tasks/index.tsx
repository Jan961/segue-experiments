import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
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
import { isNullOrEmpty } from 'utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions } = useTasksFilter();

  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    if (isNullOrEmpty(users)) {
      return [];
    }

    return Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const exists = usersList.some((item) => item.text === 'All');

  if (!exists) {
    usersList.unshift({ value: -1, text: 'All' });
  }

  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters usersList={usersList} />
      </div>
      {filteredProductions.length === 0 ? (
        <TasksTable rowData={[]} />
      ) : (
        filteredProductions.map((production) => {
          const columnDefs = getColumnDefs(usersList, production);
          return (
            <div key={production.Id} className="mb-10">
              <TasksTable
                tableHeight={filteredProductions.length > 1}
                rowData={production.Tasks}
                columnDefs={columnDefs}
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
  const productionJump = await getProductionJumpState(ctx, 'tasks');
  const productionsWithTasks = await getProductionsAndTasks(ctx.req as NextApiRequest);

  const users = await getUsers(AccountId);

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
