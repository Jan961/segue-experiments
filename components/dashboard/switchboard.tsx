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

export const Switchboard = () => {
  const links = [
    {
      title: 'Bookings',
      route: '/bookings',
      icon: faCalendarAlt,
      color: 'bg-primary-orange',
    },
    {
      title: 'Tasks',
      route: '/tasks',
      icon: faCheckSquare,
      color: 'bg-primary-yellow',
    },
    {
      title: 'Marketing',
      route: '/marketing',
      icon: faVolumeHigh,
      color: 'bg-primary-green',
    },
    {
      title: 'Contracts',
      route: '/contracts',
      icon: faFile,
      color: 'bg-primary-blue',
    },
    {
      title: 'Reports',
      route: '/reports',
      icon: faChartLine,
      color: 'bg-primary-purple',
    },
    {
      title: 'Account',
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
      title: 'Touring Management',
      route: '/touring',
      icon: faLocationDot,
      color: 'bg-primary-navy',
    },
  ];

  return (
    <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4 max-w-2xl mx-auto">
      {links.map((link) => (
        <SwitchBoardItem key={link.route} link={link} />
      ))}
    </ul>
  );
};
