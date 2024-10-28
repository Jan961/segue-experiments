import Layout from 'components/Layout';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import ProductionCompaniesTab from 'components/admin/tabs/ProductionCompaniesTab';
import CompanyDetailsTab from 'components/admin/tabs/AccountDetailsTab';
import { useRouter } from 'next/router';
import { isNullOrUndefined } from 'utils';
import { accessAdminHome } from 'state/account/selectors/permissionSelector';
import { useRecoilValue } from 'recoil';

const tabs = [
  { name: 'Account Details', permission: 'ACCESS_ACCOUNT_DETAILS' },
  { name: 'Production Companies', permission: 'ACCESS_PRODUCTION_COMPANIES' },
];

export default function CompanyInformation() {
  const router = useRouter();
  const tabIndex = isNullOrUndefined(router.query.tabIndex) ? 0 : parseInt(router.query.tabIndex[0]);
  const permissions = useRecoilValue(accessAdminHome);

  return (
    <Layout title="Company Details | Segue" flush>
      <h1 className="mt-3 text-4xl font-bold text-primary-pink">Company Details</h1>
      <div className="w-[96rem] mx-auto mt-12">
        {permissions.includes('ACCESS_COMPANY_DETAILS') && (
          <Tabs
            defaultIndex={tabIndex}
            tabs={tabs.filter((tab) => permissions.includes(tab.permission)).map((tab) => tab.name)}
            selectedTabClass="!bg-primary-pink/[0.50] !text-primary-navy"
            buttonWidth="w-1/2"
          >
            {permissions.includes('ACCESS_ACCOUNT_DETAILS') ? (
              <Tab.Panel>
                <CompanyDetailsTab />
              </Tab.Panel>
            ) : (
              <div />
            )}
            {permissions.includes('ACCESS_PRODUCTION_COMPANIES') ? (
              <Tab.Panel className="h-[650px] overflow-y-hidden">
                <ProductionCompaniesTab />
              </Tab.Panel>
            ) : (
              <div />
            )}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
