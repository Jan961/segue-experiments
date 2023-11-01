import {
  faBullhorn,
  faCalendarCheck,
  faChartLine,
  faClipboardList,
  faClose,
  faFileSignature,
  faHome,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegueLogo } from './global/SegueLogo';
import { useRecoilValue } from 'recoil';
import { tourJumpState } from 'state/booking/tourJumpState';
import Link from 'next/link';

export const PopoutMenu = ({ menuIsOpen, setMenuIsOpen }: any, data?: any) => {
  // If no path, you need to add a tourJump to the page. This is a global state
  const tourJump = useRecoilValue(tourJumpState);

  const { selected, tours } = tourJump;
  const tour = tours.filter((x) => x.Id === selected)[0];

  const path = tour ? `${tour.ShowCode}/${tour.Code}` : '';
  const noTourSelected = !path;

  const menuItems = [
    {
      label: 'Home',
      link: '/',
      icon: faHome,
      activeColor: 'text-primary-blue',
    },
    {
      label: 'Bookings',
      link: noTourSelected ? '/bookings' : `/bookings/${path}`,
      icon: faCalendarCheck,
      activeColor: 'text-primary-blue',
    },
    {
      label: 'Marketing',
      link: noTourSelected ? '/marketing' : `/marketing/${path}`,
      icon: faBullhorn,
      activeColor: 'text-primary-green',
      subItems: [
        { label: 'Venue Data Status', link: '/marketing/venue/status/' },
        {
          label: 'Venue History Entry',
          link: `/${data.Tour}/marketing/venue/status`,
        },
        { label: 'Sales Entry', link: '/marketing/sales/entry' },
        { label: 'Final Figures Entry', link: '/marketing/sales/final' },
        { label: 'Load Sales History', link: '/marketing/sales/history-load' },
        { label: 'Global Activities', link: '/marketing/activity/global' },
      ],
    },
    {
      label: 'Contracts',
      link: noTourSelected ? '/contracts' : `/contracts/${path}`,
      icon: faFileSignature,
      activeColor: 'text-primary-pink',
    },
    {
      label: 'Reports',
      link: '/reports',
      icon: faChartLine,
      activeColor: 'text-primary-blue',
    },
    {
      label: 'Tasks',
      link: '/tasks',
      icon: faClipboardList,
      activeColor: 'text-primary-purple',
    },
    /*
    {
      label: 'Admin',
      link: '#',
      icon: faUserGear,
      activeColor: 'text-primary-orange',
      subItems: [
        {
          label: 'Venues',
          link: '/venues/20'
        }
      ]
    }
    */
  ];

  const close = () => setMenuIsOpen(!menuIsOpen);

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
        <div className="overflow-y-auto overflow-x-hidden max-h-screen" style={{ height: 'calc(100vh - 88px)' }}>
          <ul>
            {menuItems.map((menuItem, index) => {
              return (
                <li key={index}>
                  <Link
                    className={`flex items-center text-sm py-2 px-4
                  size-md text-ellipsis whitespace-nowrap rounded hover:text-gray-900
                  hover:bg-gray-100 transition duration-300
                  ease-in-out text-white`}
                    href={menuItem.link}
                  >
                    {menuItem.icon && (
                      <span className="mr-2">
                        <FontAwesomeIcon icon={menuItem.icon} className="h-5 w-5" />
                      </span>
                    )}
                    {menuItem.label}
                  </Link>
                  {menuItem.subItems && (
                    <ul className="pl-10 text-sm">
                      {menuItem.subItems.map((subMenuItem, subIndex) => {
                        const isSubItemActive = data?.menuLabel === subMenuItem.label;
                        return (
                          <li key={subIndex}>
                            <Link
                              className={`flex items-center text-sm py-1 px-2 
                            text-ellipsis whitespace-nowrap rounded
                             hover:text-gray-900 hover:bg-gray-100 
                             transition duration-300 ease-in-out 
                             ${isSubItemActive ? menuItem.activeColor : 'text-white'}`}
                              href={subMenuItem.link}
                            >
                              {subMenuItem.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
