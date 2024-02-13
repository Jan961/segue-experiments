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
      },
      {
        label: getStrings('global.bookings'),
        value: noTourSelected ? '/bookings' : `/bookings/${path}`,
        icon: bookingsIcon,
        labelClass: groupHeader,
        options: [
          { label: 'Bookings Home', value: '/bookings', labelClass: leve2 },
          { label: 'Manage Shows / Productions', value: '', labelClass: leve2 },
        ],
      },
      {
        label: getStrings('global.marketing'),
        value: noTourSelected ? '/marketing' : `/marketing/${path}`,
        icon: marketingIcon,
        labelClass: groupHeader,
        options: [
          {
            label: 'Marketing Home',
            value: noTourSelected ? '/marketing' : `/marketing/${path}`,
            labelClass: leve2,
            options: [
              { label: 'Sales', value: '', labelClass: level3 },
              { label: 'Archived Sales', value: '', labelClass: level3 },
              { label: 'Activities', value: '', labelClass: level3 },
              { label: 'Contact Notes', value: '', labelClass: level3 },
              { label: 'Venue Contacts', value: '', labelClass: level3 },
              { label: 'Promoter Holds', value: '', labelClass: level3 },
            ],
          },
          {
            label: 'Venue Data Status',
            value: `/marketing/venue/status`,
            labelClass: leve2,
          },
          { label: 'Sales Entry', value: '/marketing/sales/entry', labelClass: leve2 },
          { label: 'Final Figures Entry', value: '/marketing/sales/final', labelClass: leve2 },
          { label: 'Load Sales History', value: '/marketing/sales/history-load', labelClass: leve2 },
          { label: 'Global Activities', value: '/marketing/activity/global', labelClass: leve2 },
        ],
      },
      {
        label: getStrings('global.tasks'),
        value: '/tasks',
        icon: tasksIcon,
        labelClass: groupHeader,
        options: [
          { label: 'Production Task Lists', value: '/tasks/all', labelClass: leve2 },
          { label: 'Master Task List', value: '/tasks/master', labelClass: leve2 },
        ],
      },
      {
        label: getStrings('global.contracts'),
        value: noTourSelected ? '/contracts' : `/contracts/${path}`,
        icon: contractsIcon,
        labelClass: groupHeader,
        options: [
          { label: 'Deal Memo', value: '', labelClass: leve2 },
          { label: 'ACC Contracts', value: '', labelClass: leve2 },
          { label: 'Other Contracts', value: '', labelClass: leve2 },
        ],
      },
      {
        label: getStrings('global.touringManagement'),
        value: '/touring',
        icon: tourManagementIcon,
        labelClass: groupHeader,
        options: [
          { label: 'Performance Reports', value: '', labelClass: leve2 },
          { label: 'Merchandise', value: '', labelClass: leve2 },
          { label: 'Advance Venue Notes', value: '', labelClass: leve2 },
          { label: 'Venue Warnings', value: '', labelClass: leve2 },
          { label: 'Driver and Mileage Record', value: '', labelClass: leve2 },
          { label: 'Production Reports', value: '', labelClass: leve2 },
          { label: 'Rehearsal Schedules', value: '', labelClass: leve2 },
          { label: 'Rehearsal Reports', value: '', labelClass: leve2 },
          { label: 'Multiparty Venue Notes', value: '', labelClass: leve2 },
        ],
      },

      {
        label: getStrings('global.admin'),
        value: '/admin',
        icon: systemAdminIcon,
        labelClass: groupHeader,
        options: [
          {
            label: 'Users',
            value: '',
            labelClass: leve2,
            options: [{ label: 'Manage User Permissions', value: '', labelClass: level3 }],
          },
          { label: 'Account', value: '', labelClass: leve2 },
          { label: 'Payment Details', value: '', labelClass: leve2 },
          { label: 'Venue Information', value: '', labelClass: leve2 },
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