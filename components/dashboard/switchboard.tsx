import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import { SwitchBoardSkeletonGrid } from 'components/global/SwitchBoardItemSkeletonLoader';
import useStrings from 'hooks/useStrings';
import { useRecoilValue } from 'recoil';
import { accessHome, isPermissionsInitialised } from 'state/account/selectors/permissionSelector';

export const Switchboard = () => {
  const permissions = useRecoilValue(accessHome);
  const isInitialised = useRecoilValue(isPermissionsInitialised);
  const getStrings = useStrings();

  const links = [
    {
      title: getStrings('global.bookings'),
      route: '/bookings',
      icon: null,
      iconName: 'bookings',
      stroke: '',
      fill: '',
      color: 'bg-primary-orange',
      permission: 'BOOKINGS',
    },
    {
      title: getStrings('global.marketing'),
      route: '/marketing',
      icon: null,
      stroke: '',
      fill: '#41A29A',
      iconName: 'marketing',
      color: 'bg-primary-green',
      permission: 'MARKETING',
    },
    {
      title: getStrings('global.projectManagement'),
      route: '/tasks',
      icon: null,
      stroke: '',
      fill: '#FFF',
      iconName: 'tasks',
      color: 'bg-primary-yellow',
      permission: 'PROJECT_MANAGEMENT',
    },
    {
      title: getStrings('global.contracts'),
      route: '/contracts',
      icon: null,
      stroke: '',
      fill: '',
      iconName: 'contracts',
      color: 'bg-primary-blue',
      permission: 'CONTRACTS',
    },
    {
      title: getStrings('global.touringManagement'),
      route: '/touring',
      icon: null,
      stroke: '',
      fill: '#FFF',
      iconName: 'production-management',
      color: 'bg-primary-purple',
      tooltipMessage: 'Coming soon!',
      disabled: true,
      permission: 'TOURING_MANAGEMENT',
    },
    {
      title: getStrings('global.admin'),
      route: '/admin',
      icon: null,
      stroke: '#FFF',
      fill: '#E94580',
      iconName: 'system-admin',
      color: 'bg-primary-pink',
      permission: 'SYSTEM_ADMIN',
    },
  ];

  if (!isInitialised) {
    return <SwitchBoardSkeletonGrid count={5} />;
  }
  return (
    <ul
      data-testid="dashboard-tiles"
      role="list"
      className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-3 mt-4 mx-auto"
    >
      {links
        .filter(({ permission }) => permissions.includes(permission))
        .map((link) => (
          <SwitchBoardItem key={link.route} link={link} />
        ))}
    </ul>
  );
};
