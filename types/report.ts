export interface Report {
  performanceTime?: string;
  actOneUpTime?: string;
  actOneDownTime?: string;
  actTwoDownTime?: string;
  intervalDownTime?: string;
  getOutTime?: string;
  castCrewAbsence?: string;
  castCrewInjury?: string;
  dutyTechnician?: string;
  technicalNote?: string;
  performanceNote?: string;
  setPropCustumeNote?: string;
  audienceNote?: string;
  merchandiseNote?: string;
  generalRemarks?: string;
  distributionList?: string;
  venue?: string;
  town?: string;
  performanceDate?: string;
  csm?: string;
  lighting?: string;
  asm?: string;
  actOneDuration?: number;
  actTwoDuration?: number;
  intervalDuration?: number;
  getOutDuration?: number;
  bookingId?: string;
  performanceId?: string;
  reportImageUrl?: string;
  id?: string;
  createdAt?: string;
  reportNumber?: number;
}

export type ReportFormInputs = Pick<
  Report,
  | 'actOneUpTime'
  | 'actOneDownTime'
  | 'intervalDownTime'
  | 'actTwoDownTime'
  | 'getOutTime'
  | 'dutyTechnician'
  | 'castCrewAbsence'
  | 'castCrewInjury'
  | 'technicalNote'
  | 'performanceNote'
  | 'setPropCustumeNote'
  | 'audienceNote'
  | 'merchandiseNote'
  | 'generalRemarks'
  | 'distributionList'
>;
