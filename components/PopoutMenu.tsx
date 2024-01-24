import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegueLogo } from './global/SegueLogo';
import { useRecoilValue } from 'recoil';
import { tourJumpState } from 'state/booking/tourJumpState';
import useStrings from 'hooks/useStrings';
import HierarchicalMenu from './core-ui-lib/HierarchicalMenu';
import { MenuOption } from './core-ui-lib/HierarchicalMenu/types';
import { useRouter } from 'next/router';
import {
  bookingsIcon,
  contractsIcon,
  homeIcon,
  marketingIcon,
  systemAdminIcon,
  tasksIcon,
  tourManagementIcon,
} from 'config/global';

export const PopoutMenu = ({ menuIsOpen, setMenuIsOpen }: any, data?: any) => {
  // If no path, you need to add a tourJump to the page. This is a global state
  const tourJump = useRecoilValue(tourJumpState);
  const getStrings = useStrings();
  const router = useRouter();

  const { selected, tours } = tourJump;
  const tour = tours.filter((x) => x.Id === selected)[0];

  const path = tour ? `${tour.ShowCode}/${tour.Code}` : '';
  const noTourSelected = !path;

  const menuItems = [
    {
      label: getStrings('global.home'),
      value: '/',
      icon: homeIcon,
      activeColor: 'text-primary-blue',
      classNames: '',
    },
    {
      label: getStrings('global.bookings'),
      value: noTourSelected ? '/bookings' : `/bookings/${path}`,
      icon: bookingsIcon,
      activeColor: 'text-primary-blue',
      classNames: '',
    },
    {
      label: getStrings('global.marketing'),
      value: noTourSelected ? '/marketing' : `/marketing/${path}`,
      icon: marketingIcon,
      activeColor: 'text-primary-green',
      classNames: '',
      options: [
        { label: 'Venue Data Status', value: '/marketing/venue/status/' },
        {
          label: 'Venue History Entry',
          value: `/${data.Tour}/marketing/venue/status`,
        },
        { label: 'Sales Entry', value: '/marketing/sales/entry' },
        { label: 'Final Figures Entry', value: '/marketing/sales/final' },
        { label: 'Load Sales History', value: '/marketing/sales/history-load' },
        { label: 'Global Activities', value: '/marketing/activity/global' },
      ],
    },
    {
      label: getStrings('global.contracts'),
      value: noTourSelected ? '/contracts' : `/contracts/${path}`,
      icon: contractsIcon,
      activeColor: 'text-primary-pink',
      classNames: '',
    },
    {
      label: getStrings('global.tasks'),
      value: '/tasks',
      icon: tasksIcon,
      activeColor: 'text-primary-purple',
      classNames: '',
      options: [
        { label: 'Production Task Lists', value: '/tasks/all' },
        { label: 'Master Task List', value: '/tasks/master' },
      ],
    },

    {
      label: getStrings('global.touringManagement'),
      value: '/touring',
      icon: tourManagementIcon,
      activeColor: 'text-primary-navy',
      classNames: '',
    },

    {
      label: getStrings('global.admin'),
      value: '/admin',
      icon: systemAdminIcon,
      activeColor: 'text-primary-orange',
      classNames: 'h-3 w-2',
    },
  ];

  const close = () => setMenuIsOpen(!menuIsOpen);
  const onMenuItemClick = (option: MenuOption) => {
    if (!option?.options?.length) {
      router.push(option.value);
    }
  };

  return (
    <>
      <div
        className={`bg-black transition-colors duration-300 
        fixed inset-0 z-20
        ${menuIsOpen ? '  bg-opacity-50 cursor-pointer' : 'pointer-events-none bg-transparent bg-opacity-100'}`}
        onClick={close}
      />
      <div
        className={`fixed left-0 top-0 bottom-0 z-40 w-60 shadow-lg
        min-h-full
       bg-primary-navy px-1 transform ease-in-out duration-300 ${menuIsOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div onClick={close} className="flex items-center cursor-pointer hover:opacity-80">
          <button className="absolute top-7 right-7 text-white">
            <FontAwesomeIcon size="xl" icon={faClose} />
          </button>
          <SegueLogo />
        </div>
        <div
          className="overflow-y-auto overflow-x-hidden max-h-screen text-primary-white"
          style={{ height: 'calc(100vh - 88px)' }}
        >
          <HierarchicalMenu options={menuItems} onClick={onMenuItemClick} />
        </div>
      </div>
    </>
  );
};
