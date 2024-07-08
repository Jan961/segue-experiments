import Layout from 'components/Layout';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import ProductionCompaniesTab from 'components/admin/tabs/ProductionCompaniesTab';
import CompanyDetailsTab from 'components/admin/tabs/AccountDetailsTab';
export default function CompanyInformation() {
  const tabs = ['Account Details', 'Production Companies'];
  return (
    <Layout title="Company Details | Segue" flush>
      <h1 className="mt-3 text-4xl font-bold text-primary-pink">Company Details</h1>
      <div className="w-[62rem] mx-auto mt-12">
        <Tabs tabs={tabs} selectedTabClass="!bg-primary-pink/[0.50] !text-primary-navy" buttonWidth="w-1/2">
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <CompanyDetailsTab />
          </Tab.Panel>
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <ProductionCompaniesTab />
          </Tab.Panel>
        </Tabs>
      </div>
    </Layout>
  );
}
