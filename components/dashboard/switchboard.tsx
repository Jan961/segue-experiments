import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import useStrings from 'hooks/useStrings';

export const Switchboard = () => {
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
    },
    {
      title: getStrings('global.marketing'),
      route: '/marketing',
      icon: null,
      stroke: '',
      fill: '#41A29A',
      iconName: 'marketing',
      color: 'bg-primary-green',
    },
    {
      title: getStrings('global.projectManagement'),
      route: '/tasks',
      icon: null,
      stroke: '',
      fill: '#FFF',
      iconName: 'tasks',
      color: 'bg-primary-yellow',
    },
    {
      title: getStrings('global.contracts'),
      route: '/contracts',
      icon: null,
      stroke: '',
      fill: '',
      iconName: 'contracts',
      color: 'bg-primary-blue',
    },
    {
      title: getStrings('global.touringManagement'),
      route: '/touring',
      icon: null,
      stroke: '',
      fill: '#FFF',
      iconName: 'production-management',
      color: 'bg-primary-purple',
    },
    {
      title: getStrings('global.admin'),
      route: '/admin',
      icon: null,
      stroke: '#FFF',
      fill: '#E94580',
      iconName: 'system-admin',
      color: 'bg-primary-pink',
    },
  ];

  return (
    <ul
      data-testid="dashboard-tiles"
      role="list"
      className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-3 mt-4 mx-auto"
    >
      {links.map((link) => (
        <SwitchBoardItem key={link.route} link={link} />
      ))}
    </ul>
  );
};
