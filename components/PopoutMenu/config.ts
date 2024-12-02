import {
  bookingsIcon,
  contractsIcon,
  homeIcon,
  marketingIcon,
  systemAdminIcon,
  tasksIcon,
  tourManagementIcon,
} from 'config/global';

type MenuItem = {
  id: string;
  label: string;
  value: string;
  icon?: any;
  labelClass?: string;
  testId?: string;
  permission?: string;
  options?: MenuItem[];
};

const groupHeader = 'text-[1.0625rem] font-bold';
const leve2 = 'text-[1.0625rem]';
const level3 = 'text-[0.9375rem]';

export const getMenuItems = (getStrings): MenuItem[] => [
  {
    id: '1',
    label: getStrings('global.home'),
    value: '/',
    icon: homeIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-home',
  },
  {
    id: '2',
    label: getStrings('global.bookings'),
    value: '/bookings',
    icon: bookingsIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-bookings',
    permission: 'BOOKINGS',
    options: [
      {
        id: '21',
        label: 'Bookings Home',
        value: '/bookings',
        labelClass: leve2,
        testId: 'sidepanel-bookings-home',
        permission: 'ACCESS_BOOKING_HOME',
      },
      {
        id: '22',
        label: 'Manage Shows / Productions',
        value: '/bookings/shows',
        labelClass: leve2,
        testId: 'sidepanel-bookings-manage-shows-or-productions',
        permission: 'ACCESS_MANAGE_SHOWS_PRODUCTIONS',
      },
      {
        id: '23',
        label: 'Manage Venue Database',
        value: '/bookings/venues',
        labelClass: leve2,
        testId: 'sidepanel-bookings-manage-venue-db',
        permission: 'ACCESS_MANAGE_VENUE_DATABASE',
      },
    ],
  },
  {
    id: '3',
    label: getStrings('global.marketing'),
    value: '/marketing',
    icon: marketingIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-marketing',
    permission: 'MARKETING',
    options: [
      {
        id: '31',
        label: 'Marketing Home',
        value: '/marketing',
        labelClass: leve2,
        testId: 'sidepanel-marketing-home',
        permission: 'MARKETING',
        options: [
          {
            id: '311',
            label: 'Sales',
            value: '/marketing?tabIndex=0',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-sales',
            permission: 'ACCESS_MARKETING_HOME_-_SALES',
          },
          {
            id: '312',
            label: 'Archived Sales',
            value: '/marketing?tabIndex=1',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-archived-sales',
            permission: 'ACCESS_MARKETING_HOME_-_ARCHIVED_SALES',
          },
          {
            id: '313',
            label: 'Activities',
            value: '/marketing?tabIndex=2',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-activities',
            permission: 'ACCESS_MARKETING_HOME_-_ACTIVITIES',
          },
          {
            id: '314',
            label: 'Contact Notes',
            value: '/marketing?tabIndex=3',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-contact-notes',
            permission: 'ACCESS_MARKETING_HOME_-_CONTACT_NOTES',
          },
          {
            id: '315',
            label: 'Venue Contacts',
            value: '/marketing?tabIndex=4',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-venue-contacts',
            permission: 'ACCESS_MARKETING_HOME_-_VENUE_CONTACTS',
          },
          {
            id: '316',
            label: 'Promoter Holds',
            value: '/marketing?tabIndex=5',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-promoter-holds',
            permission: 'ACCESS_MARKETING_HOME_-_PROMOTER_HOLDS',
          },
          {
            id: '317',
            label: 'Attachments',
            value: '/marketing?tabIndex=6',
            labelClass: level3,
            testId: 'sidepanel-marketing-home-attachments',
            permission: 'ACCESS_MARKETING_HOME_-_ATTACHMENTS',
          },
        ],
      },
      {
        id: '32',
        label: 'Sales Entry',
        value: '/marketing/sales/entry',
        labelClass: leve2,
        testId: 'sidepanel-marketing-sales-entry',
        permission: 'ACCESS_SALES_ENTRY',
      },
      {
        id: '33',
        label: 'Final Figures Entry',
        value: '/marketing/sales/final',
        labelClass: leve2,
        testId: 'sidepanel-marketing-final-figures-entry',
        permission: 'ACCESS_FINAL_FIGURES_ENTRY',
      },
      {
        id: '34',
        label: 'Load Sales History',
        value: '/marketing/sales/load-history',
        labelClass: leve2,
        testId: 'sidepanel-marketing-load-sales-history',
        permission: 'ACCESS_LOAD_SALES_HISTORY',
      },
      {
        id: '35',
        label: 'Global Activities',
        value: '/marketing/activity/GlobalActivity',
        labelClass: leve2,
        testId: 'sidepanel-marketing-global-activities',
        permission: 'ACCESS_GLOBAL_ACTIVITIES',
      },
    ],
  },
  {
    id: '4',
    label: getStrings('global.projectManagement'),
    value: '/tasks',
    icon: tasksIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-project-management',
    permission: 'PROJECT_MANAGEMENT',
    options: [
      {
        id: '41',
        label: 'Production Task Lists',
        value: '/tasks',
        labelClass: leve2,
        testId: 'sidepanel-project-management-production-tasks-list',
        permission: 'ACCESS_PRODUCTION_TASK_LISTS',
      },
      {
        id: '42',
        label: 'Master Task List',
        value: '/tasks/master',
        labelClass: leve2,
        testId: 'sidepanel-project-management-master-tasks-list',
        permission: 'ACCESS_MASTER_TASK_LIST',
      },
    ],
  },
  {
    id: '5',
    label: getStrings('global.contracts'),
    value: '/contracts',
    icon: contractsIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-contracts',
    permission: 'CONTRACTS',
    options: [
      {
        id: '51',
        label: 'Venue Contracts',
        value: '/contracts/venue-contracts',
        labelClass: leve2,
        testId: 'sidepanel-contracts-venue-contracts',
        permission: 'ACCESS_VENUE_CONTRACTS',
      },
      {
        id: '52',
        label: 'Artiste Contracts',
        value: '/contracts/company-contracts/all?d=1',
        labelClass: leve2,
        testId: 'sidepanel-contracts-artiste-contracts',
        permission: 'ACCESS_ARTISTE_CONTRACTS',
      },
      {
        id: '53',
        label: 'Creative Contracts',
        value: '/contracts/company-contracts/all?d=2',
        labelClass: leve2,
        testId: 'sidepanel-contracts-creative-contracts',
        permission: 'ACCESS_CREATIVE_CONTRACTS',
      },
      {
        id: '54',
        label: 'SM / Tech / Crew Contracts',
        value: '/contracts/company-contracts/all?d=3',
        labelClass: leve2,
        testId: 'sidepanel-contracts-sm-or-tech-or-crew-contracts',
        permission: 'ACCESS_SM_/_CREW_/_TECH_CONTRACTS',
      },
    ],
  },
  {
    id: '6',
    label: getStrings('global.touringManagement'),
    value: '/touring',
    icon: tourManagementIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-touring-management',
    permission: 'TOURING_MANAGEMENT',
    options: [
      {
        id: '61',
        label: 'Performance Reports',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-performance-reports',
      },
      {
        id: '62',
        label: 'Merchandise',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-merchandise',
      },
      {
        id: '63',
        label: 'Advance Venue Notes',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-advance-venue-notes',
      },
      {
        id: '64',
        label: 'Venue Warnings',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-venue-warnings',
      },
      {
        id: '65',
        label: 'Driver and Mileage Record',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-driver-and-mileage-record',
      },
      {
        id: '66',
        label: 'Production Reports',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-production-reports',
      },
      {
        id: '67',
        label: 'Rehearsal Schedules',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-rehearsal-schedules',
      },
      {
        id: '68',
        label: 'Rehearsal Reports',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-rehearsal-reports',
      },
      {
        id: '69',
        label: 'Multiparty Venue Notes',
        value: '',
        labelClass: leve2,
        testId: 'sidepanel-touring-management-multiparty-venue-notes',
      },
    ],
  },
  {
    id: '7',
    label: getStrings('global.admin'),
    value: '/admin',
    icon: systemAdminIcon,
    labelClass: groupHeader,
    testId: 'sidepanel-system-admin',
    permission: 'SYSTEM_ADMIN',
    options: [
      {
        id: '71',
        label: 'Company Information',
        value: '/admin/company-information',
        labelClass: leve2,
        testId: 'sidepanel-system-admin-company-info',
        permission: 'ACCESS_COMPANY_DETAILS',
        options: [
          {
            id: '711',
            label: 'Account Details',
            value: '/admin/company-information/?tabIndex=0',
            labelClass: level3,
            testId: 'sidepanel-system-admin-company-info-account-details ',
            permission: 'ACCESS_ACCOUNT_DETAILS',
          },
          {
            id: '712',
            label: 'Production Companies',
            value: '/admin/company-information/?tabIndex=1',
            labelClass: level3,
            testId: 'sidepanel-system-admin-company-info-production-companies',
            permission: 'ACCESS_PRODUCTION_COMPANIES',
          },
        ],
      },
      {
        id: '72',
        label: 'Users',
        value: '/admin/users',
        labelClass: leve2,
        testId: 'sidepanel-system-admin-users',
        permission: 'ACCESS_USERS',
      },
    ],
  },
];
