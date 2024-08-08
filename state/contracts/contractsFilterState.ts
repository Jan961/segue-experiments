import { atom } from 'recoil';
import { DealMemoContractFormData } from '../../interfaces/index';
export type ContractsFilterState = {
  contractText?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  scrollToDate?: string;
  scheduleStartDate?: Date;
  scheduleEndDate?: Date;
  dealMemoStatusDropDown?: string;
  contractStatusDropDown?: string;
};

export const intialContractsFilterState: ContractsFilterState = {
  contractText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  scrollToDate: '',
  scheduleStartDate: null,
  scheduleEndDate: null,
  dealMemoStatusDropDown: 'all',
  contractStatusDropDown: 'all',
};

export const contractsFilterState = atom({
  key: 'contractsFilterState',
  default: intialContractsFilterState,
});

export const initialDealMemoDataState: DealMemoContractFormData = {
  Id: null,
  BookingId: null,
  AgreementDate: null,
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
  StandardSeatKills: '',
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
  SellNotes: '',
  SellProgCommPercent: null,
  SellMerchCommPercent: null,
  SellPitchFee: null,
  TechVenueContactId: null,
  TechArrivalDate: null,
  TechArrivalTime: null,
  NumDressingRooms: null,
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
  PrintDelUseVenueAddress: false,
  DealMemoPrice: [],
  DealMemoTechProvision: [],
  DealMemoCall: [],
  DealMemoHold: [],
};

export const dealMemoInitialState = atom({
  key: 'dealMemoInitialState',
  default: initialDealMemoDataState,
});
