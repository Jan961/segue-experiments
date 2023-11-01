import Layout from 'components/Layout';
import { AccountSwitchBoard } from 'components/account/switchboard';

export default function Profile() {
  return (
    <>
      <Layout title="Account | Segue">
        <h1 className="text-3xl font-bold p-8 text-center">Account</h1>
        <AccountSwitchBoard key={'sw'} />
      </Layout>
    </>
  );
}
