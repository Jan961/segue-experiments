import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { getMasterTasksList } from 'services/TaskService';
import { MasterTask } from '@prisma/client';
import { InitialState } from 'lib/recoil';
import MasterTaskButtons from 'components/tasks/MasterTaskButtons';
import { objectify } from 'radash';
import MasterTaskList from 'components/tasks/MasterTaskList';


const MasterTasks = () =>{
    return (
        <Layout title="Master Tasks | Seque">
            <MasterTaskButtons />
            <div className='mt-4'>
                <MasterTaskList />
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const AccountId = await getAccountIdFromReq(ctx.req);
  
    const masterTasks: MasterTask[] = await getMasterTasksList(AccountId);
    const users = await getUsers(AccountId);
    const initialState: InitialState = { tasks: {
        masterTask: masterTasks
    },
    account: {
        user: { users: objectify(users, (u) => u.Id) },
    }, 
};
    return { props: { initialState } };
  };
  
  export default MasterTasks;