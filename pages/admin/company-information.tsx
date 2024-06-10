import Layout from '../../components/Layout';
import Tabs from '../../components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import ProductionCompaniesTab from './tabs/ProductionCompaniesTab';
import SystemAdminDetailsTab from './tabs/SystemAdminDetailsTab';
import StaffDetailsTab from './tabs/StaffDetailsTab';
import CompanyDetailsTab from './tabs/CompanyDetailsTab';
export default function CompanyInformation() {
  const tabs = ['Company Details', 'Staff Details', 'System Administrator Details', 'Production Companies'];

  return (
    <Layout title="Company Details | Segue" flush>
      <h1 className="text-4xl font-bold">Company Details</h1>
      <div className="flex justify-center">
        <Tabs tabs={tabs} selectedTabClass="!bg-primary-green/[0.30] !text-primary-navy" buttonWidth="w-[244px]">
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <CompanyDetailsTab />
          </Tab.Panel>
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <StaffDetailsTab />
          </Tab.Panel>
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <SystemAdminDetailsTab />
          </Tab.Panel>
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <ProductionCompaniesTab />
          </Tab.Panel>
        </Tabs>
      </div>
    </Layout>
  );
}
