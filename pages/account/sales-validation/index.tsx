import Layout from 'components/Layout';
import { Show } from 'interfaces';
import SalesDataValidation from 'components/account/forms/salesDataValidation';

type Props = {
  items: Show[];
};

// @ts-ignore

const Index = ({ items }: Props) => (
  <Layout title="Booking | Segue">
    <SalesDataValidation></SalesDataValidation>
  </Layout>
);

export default Index;
