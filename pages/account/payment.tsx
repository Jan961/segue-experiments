import Layout from '../../components/Layout';
import { Show } from '../../interfaces';
import AccountPaymentDetails from '../../components/account/forms/paymentDetails';

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => (
  <Layout title="Payment | Segue">
    <AccountPaymentDetails></AccountPaymentDetails>
  </Layout>
);

export default Index;
