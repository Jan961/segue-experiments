import React from 'react';
import {
  BookingDTO,
  RehearsalDTO,
  GetInFitUpDTO,
  VenueMinimalDTO,
  PerformanceDTO,
  ContractsDTO,
  ContractStatusType,
  ContractBookingStatusType,
  AccountContactDTO,
  DealMemoContractFormData,
} from 'interfaces';
import { RecoilState, useRecoilCallback } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { DateBlockState, dateBlockState } from 'state/booking/dateBlockState';
import { DistanceState, distanceState } from 'state/booking/distanceState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { rehearsalState } from 'state/booking/rehearsalState';
import { venueState } from 'state/booking/venueState';
import { performanceState } from 'state/booking/performanceState';
import { DateTypeState, dateTypeState } from 'state/booking/dateTypeState';
import { OtherState, otherState } from 'state/booking/otherState';
import { ProductionJump, productionJumpState } from 'state/booking/productionJumpState';
import { BookingJump, bookingJumpState } from 'state/marketing/bookingJumpState';
import { VenueRole, venueRoleState } from 'state/marketing/venueRoleState';
import { ProductionState, productionState } from 'state/tasks/productionState';
import { BulkSelectionState, bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { UserState, userState } from 'state/account/userState';
import { MasterTaskStateType, masterTaskState } from 'state/tasks/masterTaskState';
import { tasksfilterState, TasksFilterType } from 'state/tasks/tasksFilterState';
import { GlobalStateType, globalState } from 'state/global/globalState';
import { townState } from 'state/marketing/townState';
import { tabState } from 'state/marketing/tabState';
import { contractsState } from 'state/contracts/contractsState';
import { contractsOtherState } from 'state/contracts/contractsOtherState';
import { contractsDateBlockState } from 'state/contracts/contractsDateBlockState';
import { contractsDateTypeState } from 'state/contracts/contractsDateTypeState';
import { contractsPerformanceState } from 'state/contracts/contractsPerformanceState';
import { contractsVenueState } from 'state/contracts/contractsVenueState';
import {
  contractsBookingStatusState,
  contractsStatusState,
  dealMemoStatusState,
} from 'state/contracts/contractsStatusState';
import { contractRehearsalState } from 'state/contracts/contractRehearsalState';
import { contractGetInFitUpState } from 'state/contracts/contractGetInFitUpState';
import { currencyState, TCurrencySymbol } from 'state/global/currencyState';
import { CurrencyList, currencyListState } from 'state/productions/currencyState';
import { ProductionCompanyList, productionCompanyState } from 'state/productions/productionCompanyState';
import { currentUserState } from 'state/marketing/currentUserState';
import { TCountryState, countryState } from 'state/global/countryState';
import { TContractsFilterState, contractsFilterState } from 'state/contracts/contractsFilterState';
import { TPersonState, personState } from 'state/contracts/PersonState';
import { TStandardClauseState, standardClauseState } from 'state/contracts/standardClauseState';
import { TContractListState, contractListState } from 'state/contracts/contractsListState';
import { TContractDepartmentState, contractDepartmentState } from 'state/contracts/contractDepartmentState';
import { accountContactState } from 'state/contracts/accountContactState';
import { contractTemplateState, TContractTemplateState } from 'state/contracts/contractTemplateState';

/*
  Experimental attempt to get Recoil.js working with SSR in React in a DRY manner.
  Anything included as a prop in `initialState` that fits the following interface
  will be automatically instanciated, both client side and server side
*/

export type InitialState = Partial<{
  global?: {
    productionJump?: ProductionJump;
    userPrefs?: GlobalStateType;
    countryList?: TCountryState;
  };
  tasks?: {
    productions?: ProductionState;
    bulkSelection?: BulkSelectionState;
    masterTask?: MasterTaskStateType;
    tasksFilter?: TasksFilterType;
  };
  booking?: {
    booking?: Record<number, BookingDTO>;
    rehearsal?: Record<number, RehearsalDTO>;
    getInFitUp?: Record<number, GetInFitUpDTO>;
    other?: OtherState;
    dateBlock?: DateBlockState;
    dateType?: DateTypeState;
    performance?: Record<number, PerformanceDTO>;
    distance?: DistanceState;
    venue?: Record<number, VenueMinimalDTO>;
  };
  contracts?: {
    booking?: Record<number, ContractsDTO>;
    rehearsal?: Record<number, RehearsalDTO>;
    getInFitUp?: Record<number, GetInFitUpDTO>;
    other?: OtherState;
    dateBlock?: DateBlockState;
    dateType?: DateTypeState;
    performance?: Record<number, PerformanceDTO>;
    venue?: Record<number, VenueMinimalDTO>;
    contractStatus?: Record<number, ContractStatusType>;
    dealMemoStatus?: Record<number, DealMemoContractFormData>;
    contractBookingStatus?: Record<number, ContractBookingStatusType>;
    status?: Record<number, ContractStatusType>;
    filters?: TContractsFilterState;
    person?: TPersonState;
    template?: TContractTemplateState;
    standardClause?: TStandardClauseState;
    contract?: TContractListState;
    department?: TContractDepartmentState;
    accountContacts?: Record<number, AccountContactDTO>;
    currencySymbol?: TCurrencySymbol;
  };
  marketing?: {
    bookingJump?: BookingJump;
    venueRole?: VenueRole;
    towns?: Array<string>;
    venueList?: Record<number, VenueMinimalDTO>;
    defaultTab?: number;
    users?: any;
    currencySymbol: string;
    currentUser: string;
  };
  account?: {
    user: UserState;
  };
  productions?: {
    currencyList?: CurrencyList;
    productionCompanyList?: ProductionCompanyList;
  };
}>;

const states: {
  global: Record<keyof InitialState['global'], RecoilState<any>>;
  tasks: Record<keyof InitialState['tasks'], RecoilState<any>>;
  booking: Record<keyof InitialState['booking'], RecoilState<any>>;
  contracts: Record<keyof InitialState['contracts'], RecoilState<any>>;
  marketing: Record<keyof InitialState['marketing'], RecoilState<any>>;
  account: Record<keyof InitialState['account'], RecoilState<any>>;
  productions: Record<keyof InitialState['productions'], RecoilState<any>>;
} = {
  global: {
    productionJump: productionJumpState,
    userPrefs: globalState,
    countryList: countryState,
  },
  tasks: {
    productions: productionState,
    bulkSelection: bulkSelectionState,
    masterTask: masterTaskState,
    tasksFilter: tasksfilterState,
  },
  booking: {
    booking: bookingState,
    rehearsal: rehearsalState,
    getInFitUp: getInFitUpState,
    other: otherState,
    dateType: dateTypeState,
    venue: venueState,
    distance: distanceState,
    dateBlock: dateBlockState,
    performance: performanceState,
  },
  contracts: {
    booking: contractsState,
    rehearsal: contractRehearsalState,
    getInFitUp: contractGetInFitUpState,
    other: contractsOtherState,
    dateBlock: contractsDateBlockState,
    dateType: contractsDateTypeState,
    performance: contractsPerformanceState,
    venue: contractsVenueState,
    contractStatus: contractsStatusState,
    dealMemoStatus: dealMemoStatusState,
    contractBookingStatus: contractsBookingStatusState,
    status: contractsStatusState,
    filters: contractsFilterState,
    person: personState,
    template: contractTemplateState,
    standardClause: standardClauseState,
    contract: contractListState,
    department: contractDepartmentState,
    accountContacts: accountContactState,
    currencySymbol: currencyState,
  },
  marketing: {
    bookingJump: bookingJumpState,
    venueRole: venueRoleState,
    towns: townState,
    venueList: venueState,
    defaultTab: tabState,
    users: userState,
    currencySymbol: currencyState,
    currentUser: currentUserState,
  },
  account: {
    user: userState,
  },
  productions: {
    currencyList: currencyListState,
    productionCompanyList: productionCompanyState,
  },
};

export const setInitialStateServer = (snapshot, initialState: InitialState) => {
  for (const pageKey in initialState) {
    for (const key in initialState[pageKey]) {
      const state = states[pageKey][key];
      if (state) snapshot.set(state, initialState[pageKey][key]);
    }
  }
};

const useSetMultipleRecoilStates = () => {
  return useRecoilCallback(
    ({ set }) =>
      (initialData: InitialState) => {
        for (const pageKey in initialData) {
          for (const key in initialData[pageKey]) {
            const state = states[pageKey][key];
            if (state) set(state, initialData[pageKey][key]);
          }
        }
      },
    [],
  );
};
// Included at the root of the app to automatically set any states it can
export const ClientStateSetter = ({ intitialState }: { intitialState: InitialState }) => {
  const setMultipleRecoilStates = useSetMultipleRecoilStates();
  React.useEffect(() => {
    if (intitialState) {
      setMultipleRecoilStates(intitialState);
    }
  }, [intitialState, setMultipleRecoilStates]);

  return null;
};
