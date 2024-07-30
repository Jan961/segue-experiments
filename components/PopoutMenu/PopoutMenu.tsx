import { SegueLogo } from '../global/SegueLogo';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import useStrings from 'hooks/useStrings';
import HierarchicalMenu from '../core-ui-lib/HierarchicalMenu';
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
import { useEffect, useMemo, useRef } from 'react';
import Icon from 'components/core-ui-lib/Icon';
import { globalState } from 'state/global/globalState';

const groupHeader = 'text-[1.0625rem] font-bold';
const leve2 = 'text-[1.0625rem]';
const level3 = 'text-[0.9375rem]';

export default function PopoutMenu({ menuIsOpen, setMenuIsOpen }: any, data?: any) {
  const [state, setGlobalState] = useRecoilState(globalState);
  const isMenuPinned = useRef(false);
  const menuRef = useRef(null);
  // If no path, you need to add a tourJump to the page. This is a global state
  const jump = useRecoilValue(productionJumpState);
  const getStrings = useStrings();
  const router = useRouter();
  const ref = useRef();
  const { selected, productions } = jump;
  const tour = productions.filter((x) => x.Id === selected)[0];

  const path = tour ? `${tour.ShowCode}/${tour.Code}` : '';
  const noTourSelected = !path;

  const menuItems = useMemo(
    () => [
      {
        label: getStrings('global.home'),
        value: '/',
        icon: homeIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-home',
      },
      {
        label: getStrings('global.bookings'),
        value: '/bookings',
        icon: bookingsIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-bookings',
        options: [
          { label: 'Bookings Home', value: '/bookings', labelClass: leve2, testId: 'sidepanel-bookings-home' },
          {
            label: 'Manage Shows / Productions',
            value: '/bookings/shows',
            labelClass: leve2,
            testId: 'sidepanel-bookings-manage-shows-or-productions',
          },
          {
            label: 'Manage Venue Database',
            value: '/bookings/venues',
            labelClass: leve2,
            testId: 'sidepanel-bookings-manage-venue-db',
          },
        ],
      },
      {
        label: getStrings('global.marketing'),
        value: '/marketing',
        icon: marketingIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-marketing',
        options: [
          {
            label: 'Marketing Home',
            value: '/marketing',
            labelClass: leve2,
            testId: 'sidepanel-marketing-home',
            options: [
              {
                label: 'Sales',
                value: '/marketing?tabIndex=0',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-sales',
              },
              {
                label: 'Archived Sales',
                value: '/marketing?tabIndex=1',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-archived-sales',
              },
              {
                label: 'Activities',
                value: '/marketing?tabIndex=2',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-activities',
              },
              {
                label: 'Contact Notes',
                value: '/marketing?tabIndex=3',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-contact-notes',
              },
              {
                label: 'Venue Contacts',
                value: '/marketing?tabIndex=4',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-venue-contacts',
              },
              {
                label: 'Promoter Holds',
                value: '/marketing?tabIndex=5',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-promoter-holds',
              },
              {
                label: 'Attachments',
                value: '/marketing?tabIndex=6',
                labelClass: level3,
                testId: 'sidepanel-marketing-home-attachments',
              },
            ],
          },
          {
            label: 'Sales Entry',
            value: '/marketing/sales/entry',
            labelClass: leve2,
            testId: 'sidepanel-marketing-sales-entry',
          },
          {
            label: 'Final Figures Entry',
            value: '/marketing/sales/final',
            labelClass: leve2,
            testId: 'sidepanel-marketing-final-figures-entry',
          },
          {
            label: 'Load Sales History',
            value: '/marketing/sales/history-load',
            labelClass: leve2,
            testId: 'sidepanel-marketing-load-sales-history',
          },
          {
            label: 'Global Activities',
            value: '/marketing/activity/GlobalActivity',
            labelClass: leve2,
            testId: 'sidepanel-marketing-global-activities',
          },
        ],
      },
      {
        label: getStrings('global.projectManagement'),
        value: '/tasks',
        icon: tasksIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-project-management',
        options: [
          {
            label: 'Production Task Lists',
            value: '/tasks',
            labelClass: leve2,
            testId: 'sidepanel-project-management-production-tasks-list',
          },
          {
            label: 'Master Task List',
            value: '/tasks/master',
            labelClass: leve2,
            testId: 'sidepanel-project-management-master-tasks-list',
          },
        ],
      },
      {
        label: getStrings('global.contracts'),
        value: '/contracts',
        icon: contractsIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-contracts',
        options: [
          {
            label: 'Venue Contracts',
            value: '/contracts/venue-contracts',
            labelClass: leve2,
            testId: 'sidepanel-contracts-venue-contracts',
          },
          { label: 'Artiste Contracts', value: '', labelClass: leve2, testId: 'sidepanel-contracts-artiste-contracts' },
          {
            label: 'Creative Contracts',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-contracts-creative-contracts',
          },
          {
            label: 'SM / Tech / Crew Contracts',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-contracts-sm-or-tech-or-crew-contracts',
          },
        ],
      },
      {
        label: getStrings('global.touringManagement'),
        value: '/touring',
        icon: tourManagementIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-touring-management',
        options: [
          {
            label: 'Performance Reports',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-performance-reports',
          },
          { label: 'Merchandise', value: '', labelClass: leve2, testId: 'sidepanel-touring-management-merchandise' },
          {
            label: 'Advance Venue Notes',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-advance-venue-notes',
          },
          {
            label: 'Venue Warnings',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-venue-warnings',
          },
          {
            label: 'Driver and Mileage Record',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-driver-and-mileage-record',
          },
          {
            label: 'Production Reports',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-production-reports',
          },
          {
            label: 'Rehearsal Schedules',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-rehearsal-schedules',
          },
          {
            label: 'Rehearsal Reports',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-rehearsal-reports',
          },
          {
            label: 'Multiparty Venue Notes',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-touring-management-multiparty-venue-notes',
          },
        ],
      },

      {
        label: getStrings('global.admin'),
        value: '/admin',
        icon: systemAdminIcon,
        labelClass: groupHeader,
        testId: 'sidepanel-system-admin',
        options: [
          {
            label: 'Company Information',
            value: '/admin/company-information',
            labelClass: leve2,
            testId: 'sidepanel-system-admin-company-info',
            options: [
              {
                label: 'Company Details',
                value: '',
                labelClass: level3,
                testId: 'sidepanel-system-admin-company-info-company-details',
              },
              {
                label: 'Staff Details',
                value: '',
                labelClass: level3,
                testId: 'sidepanel-system-admin-company-info-staff-details',
              },
              {
                label: 'System Administrator(s)',
                value: '',
                labelClass: level3,
                testId: 'sidepanel-system-admin-company-info-system-administrator',
              },
              {
                label: 'Production Companies',
                value: '',
                labelClass: level3,
                testId: 'sidepanel-system-admin-company-info-production-companies',
              },
            ],
          },

          {
            label: 'Users',
            value: '',
            labelClass: leve2,
            testId: 'sidepanel-system-admin-users',
            options: [
              {
                label: 'Manage User Permissions',
                value: '',
                labelClass: level3,
                testId: 'sidepanel-system-admin-users-manage-user-permissions',
              },
            ],
          },
          { label: 'Account', value: '', labelClass: leve2, testId: 'sidepanel-system-admin-account' },
          { label: 'Payment Details', value: '', labelClass: leve2, testId: 'sidepanel-system-admin-payment-details' },
          { label: 'Venue Information', value: '', labelClass: leve2, testId: 'sidepanel-system-admin-venuw-info' },
        ],
      },
    ],
    [data.Tour, path, noTourSelected, getStrings],
  );

  const close = () => {
    setGlobalState({ ...state, menuPinned: false });
    setMenuIsOpen(false);
  };

  const handleMenuClick = (option) => {
    if (option?.value) {
      router.push(option.value);
    }
  };

  const handleMenuToggle = (menuState) => {
    setGlobalState({ ...state, menuItems: menuState });
  };

  const handleOutsideClick = (e) => {
    const menuIconClicked = e.target.id === 'menu-icon';
    const closeMenu =
      !menuIconClicked && !isMenuPinned.current && ref?.current && !(ref.current as HTMLElement).contains(e.target);
    if (closeMenu) {
      close();
    }
  };

  const handlePinToggle = () => {
    isMenuPinned.current = !isMenuPinned.current;
    setGlobalState({ ...state, menuPinned: isMenuPinned.current });
    if (!isMenuPinned.current) {
      close();
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  useEffect(() => {
    isMenuPinned.current = state.menuPinned;
    if (!state.menuItems || state.menuItems.length === 0) {
      setGlobalState({ ...state, menuItems });
    }
  }, [menuItems, state, setGlobalState]);

  useEffect(() => {
    if (menuIsOpen) {
      document.addEventListener('click', handleOutsideClick, false);
      const path = router.pathname.split('/')[1];
      menuRef.current.expandParentAndChildren(`/${path}`);
    }

    return () => document.removeEventListener('click', handleOutsideClick);
  }, [menuIsOpen]);

  return (
    <div
      ref={ref}
      className={`rounded-tr-[1.875rem] fixed left-0 top-0 bottom-0 z-40 shadow-lg
        min-h-full
       bg-primary-dark-blue px-2 transform ease-in-out duration-300 ${
         menuIsOpen ? 'translate-x-0' : '-translate-x-full'
       }`}
    >
      <div className="pt-4 flex justify-center items-center">
        <SegueLogo className="w-36" />
      </div>
      <div
        className="pl-2 overflow-y-auto overflow-x-hidden max-h-screen text-primary-white"
        style={{ height: 'calc(100vh - 150px)' }}
      >
        <HierarchicalMenu
          ref={menuRef}
          options={state?.menuItems || []}
          onClick={handleMenuClick}
          onToggle={handleMenuToggle}
          className="w-64"
        />
      </div>
      <div className="pr-3 h-10 border-t-[0.5px] border-white flex justify-end items-center">
        <Icon
          fill="#FFF"
          stroke="#FFF"
          className={state.menuPinned ? '' : 'rotate-90 transform'}
          iconName="pin-close"
          onClick={handlePinToggle}
        />
      </div>
    </div>
  );
}
