import { atom } from 'recoil';
import { DealMemoContractFormData } from '../../interfaces/index';
export type TContractsFilterState = {
  contractText?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  person?: number;
  department?: number;
  scheduleStartDate?: Date;
  scheduleEndDate?: Date;
  dealMemoStatusDropDown?: string;
  contractStatusDropDown?: string;
  scrollToDate?: string;
};

export const intialContractsFilterState: TContractsFilterState = {
  contractText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  department: -1,
  person: null,
  scheduleEndDate: null,
  scheduleStartDate: null,
  dealMemoStatusDropDown: 'all',
  contractStatusDropDown: 'all',
  scrollToDate: '',
};

export const contractsFilterState = atom({
  key: 'contractsFilterState',
  default: intialContractsFilterState,
});

export const initialDealMemoDataState: DealMemoContractFormData = {
  Id: null,
  BookingId: null,
  AccContId: null,
  RunningTime: null,
  RunningTimeNotes: '',
  VatCode: '',
  PrePostShowEvents: '',
  DressingRooms: '',
  VenueCurfewTime: null,
  PerformanceNotes: '',
  ProgrammerVenueContactId: null,
  ROTTPercentage: null,
  PRSPercentage: null,
  Guarantee: false,
  GuaranteeAmount: null,
  HasCalls: false,
  PromoterSplitPercentage: null,
  VenueSplitPercentage: null,
  VenueRental: null,
  VenueRentalNotes: '',
  StaffingContra: null,
  StaffingContraNotes: '',
  AgreedContraItems: null,
  AgreedContraItemsNotes: '',
  BOMVenueContactId: null,
  OnSaleDate: null,
  SettlementVenueContactId: null,
  SellableSeats: null,
  MixerDeskPosition: '',
  RestorationLevy: null,
  BookingFees: null,
  CCCommissionPercent: null,
  TxnChargeOption: '',
  TxnChargeAmount: null,
  AgreedDiscounts: '',
  MaxTAAlloc: '',
  TAAlloc: '',
  TicketCopy: '',
  ProducerCompCount: null,
  OtherHolds: '',
  AgeNotes: '',
  SalesDayNum: null,
  MMVenueContactId: null,
  BrochureDeadline: null,
  FinalProofBy: null,
  PrintReqs: '',
  LocalMarketingBudget: null,
  LocalMarketingContra: null,
  SellWho: '',
  SellProgrammes: false,
  SellMerch: false,
  MerchNotes: '',
  SellProgCommPercent: null,
  SellMerchCommPercent: null,
  SellPitchFee: null,
  SendTo: null,
  TechVenueContactId: null,
  TechArrivalDate: null,
  TechArrivalTime: null,
  NumFacilitiesLaundry: false,
  NumFacilitiesDrier: false,
  NumFacilitiesLaundryRoom: false,
  NumFacilitiesNotes: '',
  NumCateringNotes: '',
  BarringClause: '',
  AdvancePaymentRequired: false,
  AdvancePaymentAmount: null,
  AdvancePaymentDueBy: null,
  SettlementDays: null,
  ContractClause: '',
  PrintDelUseVenueAddress: true,
  PrintDelVenueAddressLine: '',
  DealMemoPrice: [],
  DealMemoTechProvision: [],
  DealMemoCall: [],
  DealMemoHold: [],
  SettlementSameDay: false,
  SeatKillNotes: '',
};

export const dealMemoInitialState = atom({
  key: 'dealMemoInitialState',
  default: initialDealMemoDataState,
});
