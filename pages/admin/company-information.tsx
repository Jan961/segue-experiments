import Layout from 'components/Layout';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import ProductionCompaniesTab from 'components/admin/tabs/ProductionCompaniesTab';
import CompanyDetailsTab from 'components/admin/tabs/AccountDetailsTab';
import { router } from 'next/client';
import { isNullOrUndefined } from 'is-what';
import { useState } from 'react';
export default function CompanyInformation() {
  const [tabIndex, setTabIndex] = useState(0);

  const defaultIndex = isNullOrUndefined(router.query.tabIndex)
    ? setTabIndex(0)
    : setTabIndex(parseInt(router.query.tabIndex[0]));
  console.log(defaultIndex);

  const tabs = ['Account Details', 'Production Companies'];
  return (
    <Layout title="Company Details | Segue" flush>
      <h1 className="mt-3 text-4xl font-bold text-primary-pink">Company Details</h1>
      <div className="w-[96rem] mx-auto mt-12">
        <Tabs
          defaultIndex={tabIndex}
          tabs={tabs}
          selectedTabClass="!bg-primary-pink/[0.50] !text-primary-navy"
          buttonWidth="w-1/2"
        >
          <Tab.Panel>
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
