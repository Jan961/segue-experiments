import { selector } from 'recoil';
import { contractsState } from '../../contracts/contractsState';
import { contractsDateTypeState } from '../contractsDateTypeState';
import { contractsOtherState } from '../contractsOtherState';
import { contractsVenueState } from '../contractsVenueState';
import { productionJumpState } from '../../booking/productionJumpState';
import { objectify } from 'radash';
import { contractsRow } from 'config/contracts';
import {
  calculateWeekNumber,
  getKey,
  getArrayOfDatesBetween,
  newDate,
  formattedDateWithWeekDay,
} from 'services/dateService';
import { contractsPerformanceState } from '../contractsPerformanceState';
import ContractsHelper from 'utils/contracts';
import { contractsDateBlockState } from '../contractsDateBlockState';
import { DAY_TYPE_FILTERS } from 'components/bookings/utils';
import { contractsBookingStatusState, contractsStatusState, dealMemoStatusState } from '../contractsStatusState';
import { contractRehearsalState } from '../contractRehearsalState';
import { contractGetInFitUpState } from '../contractGetInFitUpState';

const getProductionName = ({ Code, ShowCode, ShowName }: any) => `${ShowCode}${Code} - ${ShowName}`;
const getProductionCode = ({ ShowCode, Code }: any) => `${ShowCode}${Code}`;

export const contractsRowsSelector = selector({
  key: 'contractsRowsSelector',
  get: ({ get }) => {
    const rehearsals = get(contractRehearsalState);
    const bookings = get(contractsState);
    const getInFitUp = get(contractGetInFitUpState);
    const contractData = get(contractsStatusState);
    const dealMemoStatus = get(dealMemoStatusState);
    const contractBookingData = get(contractsBookingStatusState);
    const performanceDict = get(contractsPerformanceState);
    const other = get(contractsOtherState);
    const venueDict = get(contractsVenueState);
    const dayTypes = get(contractsDateTypeState);
    const { productions } = get(productionJumpState);
    const productionDict = objectify(productions, (production) => production.Id);
    const dateBlocks = get(contractsDateBlockState);
    const helper = new ContractsHelper({ performanceDict, venueDict, productionDict });
    const { start, end } = helper.getRangeFromDateBlocks(dateBlocks);
    const rows: any = [];
    const bookedDates: string[] = [];
    const addRow = (date: string, type: string, data: any, transformer) => {
      const { ProductionId, PrimaryDateBlock } = data;
      const production = productionDict[ProductionId] || {};
      const rowData = transformer(data);
      const week = calculateWeekNumber(newDate(PrimaryDateBlock?.StartDate), newDate(date));
      const otherDayType = dayTypes.find(({ Id }) => Id === data.DateTypeId)?.Name;
      const getValueForDayType = (value, type) => {
        if (!value) {
          if (type === 'Other') {
            return otherDayType;
          }
          return DAY_TYPE_FILTERS.includes(type) ? type : value;
        }
        return value;
      };

      const row = {
        ...rowData,
        week,
        dateTime: date,
        date: date ? formattedDateWithWeekDay(date, 'Short') : '',
        productionName: getProductionName(production),
        production: getProductionCode(production),
        productionId: ProductionId,
        dayType: type === 'Other' ? otherDayType : type,
        bookingStatus: data?.StatusCode,
        status: data?.StatusCode,
        venue: getValueForDayType(rowData.venue, type),
        contractStatus: contractData[rowData.Id] ? contractData[rowData.Id].StatusCode : '',
        dealMemoStatus: dealMemoStatus[rowData.Id] ? dealMemoStatus[rowData.Id.toString()].Status : '',
        SignedDate: contractData[rowData.Id] ? contractData[rowData.Id].SignedDate : '',
        SignedBy: contractData[rowData.Id] ? contractData[rowData.Id].SignedBy : '',
        ReturnDate: contractData[rowData.Id] ? contractData[rowData.Id].ReturnDate : '',
        CheckedBy: contractData[rowData.Id] ? contractData[rowData.Id].CheckedBy : '',
        RoyaltyPercentage: contractData[rowData.Id] ? contractData[rowData.Id].RoyaltyPercentage : '',
        DealType: contractData[rowData.Id] ? contractData[rowData.Id].DealType : '',
        Notes: contractData[rowData.Id] ? contractData[rowData.Id].ContractNotes : '',
        ReceivedBackDate: contractData[rowData.Id] ? contractData[rowData.Id].ReceivedBackDate : '',
        Exceptions: contractData[rowData.Id] ? contractData[rowData.Id].Exceptions : '',
        BankDetailsSent: contractData[rowData.Id] ? contractData[rowData.Id].BankDetailsSent : '',
        TechSpecSent: contractData[rowData.Id] ? contractData[rowData.Id].TechSpecSent : '',
        PRSCertSent: contractData[rowData.Id] ? contractData[rowData.Id].PRSCertSent : '',
        GP: contractData[rowData.Id] ? contractData[rowData.Id].GP : '',
        PromoterPercent: contractData[rowData.Id] ? contractData[rowData.Id].PromoterPercent : '',
        DateBlockId: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].DateBlockId : '',
        VenueId: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].VenueId : '',
        FirstDate: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].FirstDate : '',
        StatusCode: contractData[rowData.Id] ? contractData[rowData.Id].StatusCode : '',
        PencilNum: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].PencilNum : '',
        LandingPageURL: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].LandingPageURL : '',
        TicketsOnSaleFromDate: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].TicketsOnSaleFromDate
          : '',
        TicketsOnSale: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].TicketsOnSale : '',
        MarketingPlanReceived: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].MarketingPlanReceived
          : '',
        ContactInfoReceived: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].ContactInfoReceived : '',
        PrintReqsReceived: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].PrintReqsReceived : '',
        bookingNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].Notes : '',
        DealNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].DealNotes : '',
        TicketPriceNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].TicketPriceNotes : '',
        MarketingDealNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].MarketingDealNotes : '',
        CrewNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].CrewNotes : '',
        SalesNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].SalesNotes : '',
        HoldNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].HoldNotes : '',
        CompNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].CompNotes : '',
        MerchandiseNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].MerchandiseNotes : '',
        CastRateTicketsNotes: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].CastRateTicketsNotes
          : '',
        CastRateTicketsArranged: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].CastRateTicketsArranged
          : '',
        RunTag: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].RunTag : '',
        MarketingCostsStatus: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].MarketingCostsStatus
          : '',
        MarketingCostsApprovalDate: contractBookingData[rowData.Id]
          ? contractBookingData[rowData.Id].MarketingCostsApprovalDate
          : '',
        MarketingCostsNotes: contractBookingData[rowData.Id] ? contractBookingData[rowData.Id].MarketingCostsNotes : '',
      };

      rows.push(row);
    };
    Object.values(rehearsals).forEach((r) => {
      bookedDates.push(getKey(r.Date));
      addRow(r.Date, 'Rehearsal', r, helper.getRehearsalDetails);
    });
    Object.values(getInFitUp).forEach((g) => {
      bookedDates.push(getKey(g.Date));
      addRow(g.Date, 'Get in / Fit Up', g, helper.getInFitUpDetails);
    });
    Object.values(bookings).forEach((b) => {
      const performancesGroup = b.PerformanceIds.reduce((performancesByDate, performanceId) => {
        const performance = performanceDict[performanceId];
        const performanceDate = new Date(getKey(performance.Date)).toISOString();
        if (performancesByDate[performanceDate]) {
          performancesByDate[performanceDate].push(performanceId);
        } else {
          performancesByDate[performanceDate] = [performanceId];
        }
        return performancesByDate;
      }, {});
      Object.keys(performancesGroup).forEach((date) => {
        bookedDates.push(getKey(date));
        addRow(
          date,
          'Performance',
          { ...b, PerformanceIds: Object.values(performancesGroup).flatMap((arr) => arr) },
          helper.getContractsDetails,
        );
      });
    });
    Object.values(other).forEach((o) => {
      bookedDates.push(getKey(o.Date));
      addRow(o.Date, o?.DateTypeName || 'Other', o, helper.getOthersDetails);
    });
    const allDates = getArrayOfDatesBetween(start, end);
    for (const date of allDates) {
      if (!bookedDates.includes(date)) {
        const production = helper.getProductionByDate(dateBlocks, date);
        if (!production) {
          continue;
        }
        const week = calculateWeekNumber(newDate(production?.StartDate), newDate(date)) || '';
        const emptyRow = {
          ...contractsRow,
          week,
          date: formattedDateWithWeekDay(date, 'Short'),
          dateTime: newDate(date).toISOString(),
          production: production ? getProductionCode(production) : '',
          productionId: production?.Id,
          productionCode: production?.Code,
        };
        rows.push(emptyRow);
      }
    }
    return { rows, scheduleStart: start, scheduleEnd: end };
  },
});
