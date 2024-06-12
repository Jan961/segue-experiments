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
  DeMoId: null,
  DeMoBookingId: null,
  DeMoAgreementDate: null,
  DeMoAccContId: null,
  DeMoRunningTime: null,
  DeMoRunningTimeNotes: '',
  DeMoPrePostShowEvents: '',
  DeMoVenueCurfewTime: null,
  DeMoPerformanceNotes: '',
  DeMoProgrammerVenueContactId: null,
  DeMoROTTPercentage: null,
  DeMoPRSPercentage: null,
  DeMoGuarantee: false,
  DeMoGuaranteeAmount: null,
  DeMoHasCalls: false,
  DeMoPromoterSplitPercentage: null,
  DeMoVenueSplitPercentage: null,
  DeMoVenueRental: null,
  DeMoVenueRentalNotes: '',
  DeMoStaffingContra: null,
  DeMoStaffingContraNotes: '',
  DeMoAgreedContraItems: null,
  DeMoAgreedContraItemsNotes: '',
  DeMoBOMVenueContactId: null,
  DeMoOnSaleDate: null,
  DeMoSettlementVenueContactId: null,
  DeMoSellableSeats: null,
  DeMoMixerDeskPosition: '',
  DeMoStandardSeatKills: '',
  DeMoRestorationLevy: null,
  DeMoBookingFees: null,
  DeMoCCCommissionPercent: null,
  DeMoTxnChargeOption: '',
  DeMoTxnChargeAmount: null,
  DeMoAgreedDiscounts: '',
  DeMoMaxTAAlloc: '',
  DeMoTAAlloc: '',
  DeMoTicketCopy: '',
  DeMoProducerCompCount: null,
  DeMoOtherHolds: '',
  DeMoAgeNotes: '',
  DeMoSalesDayNum: null,
  DeMoMMVenueContactId: null,
  DeMoBrochureDeadline: null,
  DeMoFinalProofBy: null,
  DeMoPrintReqs: '',
  DeMoLocalMarketingBudget: null,
  DeMoLocalMarketingContra: null,
  DeMoSellWho: '',
  DeMoSellProgrammes: false,
  DeMoSellMerch: false,
  DeMoSellNotes: '',
  DeMoSellProgCommPercent: null,
  DeMoSellMerchCommPercent: null,
  DeMoSellPitchFee: null,
  DeMoTechVenueContactId: null,
  DeMoTechArrivalDate: null,
  DeMoTechArrivalTime: null,
  DeMoNumDressingRooms: null,
  DeMoNumFacilitiesLaundry: false,
  DeMoNumFacilitiesDrier: false,
  DeMoNumFacilitiesLaundryRoom: false,
  DeMoNumFacilitiesNotes: '',
  DeMoNumCateringNotes: '',
  DeMoBarringClause: '',
  DeMoAdvancePaymentRequired: false,
  DeMoAdvancePaymentAmount: null,
  DeMoAdvancePaymentDueBy: null,
  DeMoSettlementDays: null,
  DeMoContractClause: '',
  DealMemoPrice: [],
  DealMemoTechProvision: [],
  DealMemoCall: [],
};

export const dealMemoInitialState = atom({
  key: 'dealMemoInitialState',
  default: initialDealMemoDataState,
});
