import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { getMasterTasksList } from 'services/TaskService';
import { MasterTask } from '@prisma/client';
import { getMasterTasksColumnDefs, styleProps } from 'components/tasks/tableConfig';
import Table from 'components/core-ui-lib/Table';
import useMasterTasksFilter from 'hooks/useMasterTaskFilter';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { useRef, useState } from 'react';
import axios from 'axios';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import Loader from 'components/core-ui-lib/Loader';
import { useRouter } from 'next/router';
import Filters from 'components/tasks/master/Filters';
import AddTask from 'components/tasks/modals/AddTask';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Loader variant="lg" iconProps={{ stroke: '#FFF' }} />
  </div>
);

const MasterTasks = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { masterTask = [], usersList } = props;
  const tableRef = useRef(null);

  const router = useRouter();

  const [taskId, setTaskId] = useState<number>(-1);

  const [currentTask, setCurrentTask] = useState({});

  const columnDefs = getMasterTasksColumnDefs(usersList);

  const { filteredTasks = [] } = useMasterTasksFilter(masterTask);

  const [confirm, setConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rowIndex, setRowIndex] = useState<number | null>(null);

  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const handleCellClick = async (e) => {
    setRowIndex(e.rowIndex);
    setTaskId(e.data.Id);
    if (e.column.colId === 'delete') {
      setConfirm(true);
    } else if (e.column.colId === 'clone') {
      delete e.data.Id;
      setShowAddTask(!showAddTask);
      setCurrentTask(e.data);
    } else if (e.column.colId === 'edit') {
      setShowAddTask(!showAddTask);
      setCurrentTask(e.data);
    }
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      await axios.delete(`/api/tasks/master/delete/${taskId}`);
      const gridApi = tableRef.current.getApi();
      const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        remove: [rowDataToRemove],
      };
      applyTransactionToGrid(tableRef, transaction);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowTask = () => {
    setShowAddTask(!showAddTask);
    if (showAddTask) {
      router.replace(router.asPath);
    }
  };

  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters handleShowTask={handleShowTask} />
      </div>
      <Table
        ref={tableRef}
        onCellClicked={handleCellClick}
        columnDefs={columnDefs}
        rowData={filteredTasks}
        styleProps={styleProps}
      />
      <ConfirmationDialog
        variant={'delete'}
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
      {isLoading && <LoadingOverlay />}
      <AddTask visible={showAddTask} isMasterTask onClose={handleShowTask} task={currentTask} />
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
