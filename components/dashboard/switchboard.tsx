import {
  faCalendarAlt,
  faChartLine,
  faCheckSquare,
  faFile,
  faLocationDot,
  faUserCog,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import useStrings from 'hooks/useStrings';

export const Switchboard = () => {
  const getStrings = useStrings();
  const links = [
    {
      title: getStrings('global.bookings'),
      route: '/bookings',
      icon: faCalendarAlt,
      iconName: 'bookings',
      color: 'bg-primary-orange',
    },
    {
      title: getStrings('global.marketing'),
      route: '/marketing',
      icon: faVolumeHigh,
      iconName: 'marketing',
      color: 'bg-primary-green',
    },
    {
      title: getStrings('global.tasks'),
      route: '/tasks',
      icon: faCheckSquare,
      iconName: 'tasks',
      color: 'bg-primary-yellow',
    },
    {
      title: getStrings('global.venueContracts'),
      route: '/contracts',
      icon: faFile,
      iconName: 'contracts',
      color: 'bg-primary-blue',
    },
    {
      title: getStrings('global.touringManagement'),
      route: '/touring',
      icon: faLocationDot,
      iconName: 'touring-management',
      color: 'bg-primary-navy',
    },
    {
      title: getStrings('global.userAccount'),
      route: '/account',
      icon: faUserCog,
      iconName: 'system-admin',
      color: 'bg-primary-pink',
    },
    // dummy item until we know what's taking its place
    {
      title: 'dummy',
      icon: faChartLine,
      iconName: 'calendar',
      color: 'bg-primary-purple',
    },
  ];

  return (
    <ul
      data-testid="dashboard-tiles"
      role="list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4 max-w-2xl mx-auto"
    >
      {links.map((link) => (
        <SwitchBoardItem key={link.route} link={link} />
      ))}
    </ul>
  );
};
