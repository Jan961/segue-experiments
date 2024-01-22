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
      color: 'bg-primary-orange',
    },
    {
      title: getStrings('global.tasks'),
      route: '/tasks',
      icon: faCheckSquare,
      color: 'bg-primary-yellow',
    },
    {
      title: getStrings('global.marketing'),
      route: '/marketing',
      icon: faVolumeHigh,
      color: 'bg-primary-green',
    },
    {
      title: getStrings('global.venueContracts'),
      route: '/contracts',
      icon: faFile,
      color: 'bg-primary-blue',
    },
    {
      title: getStrings('global.reports'),
      route: '/reports',
      icon: faChartLine,
      color: 'bg-primary-purple',
    },
    {
      title: getStrings('global.userAccount'),
      route: '/account',
      icon: faUserCog,
      color: 'bg-primary-pink',
    },
    // dummy item until we know what's taking its place
    {
      title: 'dummy',
      icon: faChartLine,
      color: 'bg-primary-purple',
    },
    {
      title: getStrings('global.touringManagement'),
      route: '/touring',
      icon: faLocationDot,
      color: 'bg-primary-navy',
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
