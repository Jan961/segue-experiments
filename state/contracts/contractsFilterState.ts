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
  DeMoId: null,
  DeMoBookingId: null,
  DeMoAgreementDate: null,
  DeMoAccContId: null,
  DeMoRunningTime: null,
  DeMoRunningTimeNotes: '',
  DeMoVatCode: '',
  DeMoPrePostShowEvents: '',
  DeMoDressingRooms: '',
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
  DeMoPrintDelUseVenueAddress: false,
  DealMemoPrice: [],
  DealMemoTechProvision: [],
  DealMemoCall: [],
  DealMemoHold: [],
};

export const dealMemoInitialState = atom({
  key: 'dealMemoInitialState',
  default: initialDealMemoDataState,
});
