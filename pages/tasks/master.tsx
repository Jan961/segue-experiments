import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { getMasterTasksList } from 'services/TaskService';
import { MasterTask } from '@prisma/client';
import Filters from 'components/tasks/Master/Filters';
import { getMasterTasksColumnDefs, styleProps } from 'components/tasks/tableConfig';
import Table from 'components/core-ui-lib/Table';
import useMasterTasksFilter from 'hooks/useMasterTaskFilter';

const MasterTasks = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { masterTask = [], usersList } = props;

  const columnDefs = getMasterTasksColumnDefs(usersList);

  const { filteredTasks = [] } = useMasterTasksFilter(masterTask);

  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters />
      </div>
      <Table columnDefs={columnDefs} rowData={filteredTasks} styleProps={styleProps} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);

  const masterTasks: MasterTask[] = await getMasterTasksList(AccountId);
  const users = await getUsers(AccountId);

  return {
    props: {
      masterTask: masterTasks,
      usersList: Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    },
  };
};

export default MasterTasks;
