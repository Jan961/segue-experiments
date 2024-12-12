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
import { useMemo, useState } from 'react';
import { getColumnDefs } from 'components/tasks/tableConfig';
import { mapToProductionTasksDTO } from 'mappers/tasks';
import Spinner from 'components/core-ui-lib/Spinner';
import { accessProjectManagement } from 'state/account/selectors/permissionSelector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions } = useTasksFilter();
  const [isShowSpinner, setIsShowSpinner] = useState<boolean>(false);
  const { users } = useRecoilValue(userState);
  const permissions = useRecoilValue(accessProjectManagement);
  const canAccessTaskNotes = permissions.includes('ACCESS_PROD_TASK_NOTES');
  const canEdit = permissions.includes('EDIT_PROD_TASK');

  const usersList = useMemo(
    () =>
      Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
        value: AccUserId,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  const exists = usersList.some((item) => item.text === 'All');

  if (!exists) {
    usersList.unshift({ value: -1, text: 'All' });
  }

  return (
    <>
      {isShowSpinner && (
        <div
          data-testid="tasks-page-spinner"
          className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center"
        >
          <Spinner size="lg" />
        </div>
      )}
      <Layout title="Tasks | Segue" flush>
        <div className="mb-8">
          <Filters usersList={usersList} />
        </div>
        {filteredProductions.length === 0 ? (
          <TasksTable rowData={[]} />
        ) : (
          filteredProductions.map((production) => {
            const columnDefs = getColumnDefs(usersList, production, canEdit, canAccessTaskNotes);
            return (
              <div key={production.Id} className="mb-10">
                <TasksTable
                  tableHeight={filteredProductions.length > 1}
                  rowData={production.Tasks}
                  columnDefs={columnDefs}
                  productionId={production.Id}
                  setIsShowSpinner={setIsShowSpinner}
                />
              </div>
            );
          })
        )}
      </Layout>
    </>
  );
};

export default TasksPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'tasks');
  productionJump.selected = -1;
  const users = await getUsers(AccountId);
  const productionsWithTasks = await getProductionsAndTasks(ctx.req as NextApiRequest);

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
