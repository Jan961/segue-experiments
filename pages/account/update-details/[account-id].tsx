import Layout from 'components/Layout';
import { Show } from 'interfaces';
import AccountDetails from 'components/account/forms/accountDetails';

type Props = {
  items: Show[];
};

// @ts-ignore

const Index = ({ items }: Props) => (
  <Layout title="Booking | Segue">
    <AccountDetails number={30}></AccountDetails>
  </Layout>
);

export default Index;
