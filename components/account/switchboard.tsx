import {
  faAddressBook,
  faCreditCard,
  faMapMarker,
  faSchool,
  faTheaterMasks,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';

export const AccountSwitchBoard = () => {
  const links = [
    {
      title: 'Users',
      route: '/account/users',
      icon: faUser,
      color: 'bg-primary-blue',
    },
    {
      title: 'Shows',
      route: '/account/shows',
      icon: faTheaterMasks,
      color: 'bg-primary-pink',
    },
    {
      title: 'Account',
      route: '/account/account',
      icon: faAddressBook,
      color: 'bg-primary-orange',
      disabled: true,
    },
    {
      title: 'Payment Details',
      route: '/account/payment',
      icon: faCreditCard,
      color: 'bg-primary-yellow',
      disabled: true,
    },
  ];

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {links.map((link) => (
        <SwitchBoardItem link={link} key={link.route} />
      ))}
    </ul>
  );
};
