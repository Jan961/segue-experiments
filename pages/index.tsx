import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-quartz.css';

import Layout from 'components/Layout';
import { Switchboard } from 'components/dashboard/switchboard';
import Image from 'next/image';

export default function Index() {
  return (
    <Layout title="Dashboard | Segue">
      <Image className="mx-auto" height={160} width={310} src="/segue/segue_logo_full.png" alt="Your Company" />
      <Switchboard />
    </Layout>
  );
}
