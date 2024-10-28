import Layout from 'components/Layout';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import { useRecoilValue } from 'recoil';
import { accessAdminHome } from 'state/account/selectors/permissionSelector';

export default function Index() {
  const permissions = useRecoilValue(accessAdminHome);
  const links = [
    {
      title: 'Company Information',
      route: '/admin/company-information',
      color: 'bg-primary-pink',
      permission: 'ACCESS_COMPANY_DETAILS',
    },
    {
      title: 'Users',
      route: '/admin/users',
      color: 'bg-primary-pink',
      permission: 'ACCESS_USERS',
    },
    {
      title: 'Payment Details',
      route: '/payment-details',
      color: 'bg-primary-pink',
      permission: 'ACCESS_PAYMENT_DETAILS',
    },
    {
      title: 'Account Preferences',
      route: '/account-preferences',
      color: 'bg-primary-pink',
      permission: 'ACCESS_ACCOUNT_PREFERENCES',
    },
  ];
  return (
    <Layout title="System Admin | Segue">
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold  text-primary-pink">System Admin</h1>
        <ul
          data-testid="system-admin-tiles"
          role="list"
          className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-4 mt-20 mx-auto "
        >
          {links
            .filter(({ permission }) => permissions.includes(permission))
            .map((link) => (
              <SwitchBoardItem key={link.route} link={link} />
            ))}
        </ul>
      </div>
    </Layout>
  );
}
