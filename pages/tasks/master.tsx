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
import AddTask from 'components/tasks/modals/AddTask';
import Filters from 'components/tasks/master/Filters';
import NewProductionTask from 'components/tasks/modals/NewProductionTask';
import ProductionTaskList from 'components/tasks/modals/ProductionTaskList';
import MasterTaskList from 'components/tasks/modals/MasterTaskList';
import NotesPopup from 'components/tasks/NotesPopup';

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
  const [showNewProduction, setShowNewProduction] = useState<boolean>(false);
  const [isMasterTaskList, setIsMasterTaskList] = useState<boolean>(false);
  const [isProductionTaskList, setIsProductionTaskList] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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
    } else if (e.column.colId === 'Notes') {
      setCurrentTask(e.data);
      setShowModal(true);
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

  const handleNewProductionTaskModal = () => {
    setShowNewProduction(false);
  };

  const handleNewProductionTaskSubmit = (val: string) => {
    handleNewProductionTaskModal();
    if (val === 'taskManual') setShowAddTask(true);
    else if (val === 'master') setIsMasterTaskList(true);
    else setIsProductionTaskList(true);
  };

  const handleMasterListClose = (val: string) => {
    setIsMasterTaskList(false);
    if (val === 'data-added') {
      router.replace(router.asPath);
    }
  };

  const handleProductionListClose = (val: string) => {
    setIsProductionTaskList(false);
    setIsMasterTaskList(false);
    if (val === 'data-added') {
      router.replace(router.asPath);
    }
  };

  const onRowDoubleClicked = (e) => {
    setCurrentTask(e.data);
    setShowAddTask(!showAddTask);
  };

  const handleSaveNote = async (value: string) => {
    setShowModal(false);
    const updatedTask = { ...currentTask, Notes: value };
    setIsLoading(true);
    try {
      await axios.put(`/api/tasks/master/update/`, updatedTask);
      router.replace(router.asPath);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-3">
        <Filters handleShowTask={handleShowTask} />
      </div>
      <div className="mb-10">
        <Table
          ref={tableRef}
          onCellClicked={handleCellClick}
          columnDefs={columnDefs}
          rowData={filteredTasks}
          styleProps={styleProps}
          onRowDoubleClicked={onRowDoubleClicked}
        />
      </div>

      <ConfirmationDialog
        variant="delete"
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
      {isLoading && <LoadingOverlay />}
      <AddTask visible={showAddTask} isMasterTask onClose={handleShowTask} task={currentTask} />
      <NewProductionTask
        visible={showNewProduction}
        onClose={handleNewProductionTaskModal}
        handleNewProductionTaskSubmit={handleNewProductionTaskSubmit}
      />
      <MasterTaskList visible={isMasterTaskList} onClose={handleMasterListClose} />
      <ProductionTaskList visible={isProductionTaskList} onClose={handleProductionListClose} isMaster />
      <NotesPopup
        show={showModal}
        currentTask={currentTask}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
      />
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
