import axios from 'axios';
import { UserAcc } from 'components/contracts/modal/EditDealMemoContractModal';
import { defaultPrice, parseAndSortDates } from 'components/contracts/utils';
import { days } from 'config/global';
import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { DealMemoHoldType, ProductionDTO } from 'interfaces';
import { formatDecimalValue, isNullOrUndefined, isUndefined, numberToOrdinal, tidyString } from 'utils';
import { formatTemplateObj } from 'utils/templateExport';

type DeMoExportProps = {
  bookingId: string;
  production: Partial<ProductionDTO>;
  contract: any;
  venue: any;
  accContacts: any;
  users: Array<UserAcc>;
  dealMemoData: any;
};

// Notes for SK-494 - comment will be removed when actioned
/*  
   1. SellNotes has been changed to MerchNotes
   2. SettlementSameDay has been added to store the boolean field
   3. NumDressingRooms removed from object but was not used and not in DB
   4. PrintUseDelVenueAddressId changed to PrintDelVenueAddressLine and made a long text field
   5. SeatKillNotes field added - this will remain disconnected from BookingHoldNotes - for the time being the value from the deal memo will need to be copied over manually (from RCK)
*/

const formatPerfs = (performances) => {
  const perfDays = parseAndSortDates(performances);
  return perfDays.length === 0
    ? [{ day: '', times: '', date: '' }]
    : perfDays.map((perf) => {
        const [day, date, ...timesArray] = perf.split(' ');
        return {
          day,
          date,
          times: timesArray.join(' '),
        };
      });
};

const formatObjKeys = (obj: any) => {
  const result = Object.keys(obj).reduce((acc, key) => {
    acc[`${key}`] = obj[key];
    return acc;
  }, {});
  return result;
};

const getContact = (array, key, value) => {
  return array.find((record) => record[key] === value);
};

const fetchTemplateDocument = async () => {
  try {
    const response = await axios.get(
      `/api/file/download?location=${'https://d1e9vbizioozy0.cloudfront.net/contracts/templates/DealMemo.docx'}`,
      {
        responseType: 'arraybuffer',
      },
    );

    const file = new File([response.data], 'template.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    return file;
  } catch (err) {
    console.error(err, 'Error - failed to fetch template document.');
  }
};

export const dealMemoExport = async (props: DeMoExportProps) => {
  if (!isNullOrUndefined(props.bookingId)) {
    const deMoRaw = props.dealMemoData;
    const { data: currResponse } = await axios.get(`/api/marketing/currency/booking/${props.bookingId}`);
    const { data: holdTypes } = await axios.get<Array<DealMemoHoldType>>(`/api/deal-memo/hold-type/read`);
    const primaryAddress = props.venue.VenueAddress.find((address) => address.TypeName === 'Main');
    const programmer = getContact(props.venue.VenueContact, 'Id', deMoRaw.ProgrammerVenueContactId);
    const boManager = getContact(props.venue.VenueContact, 'Id', deMoRaw.BOMVenueContactId);
    const accSettlment = getContact(props.venue.VenueContact, 'Id', deMoRaw.SettlementVenueContactId);
    const marketManager = getContact(props.venue.VenueContact, 'Id', deMoRaw.MMVenueContactId);
    const techManager = getContact(props.venue.VenueContact, 'Id', deMoRaw.TechVenueContactId);
    const deMoPoc = getContact(props.accContacts, 'AccContId', deMoRaw.AccContId);
    const companyPoc = getContact(props.accContacts, 'AccContId', deMoRaw.CompAccContId);

    const salesRepEmails = isUndefined(deMoRaw.SendTo)
      ? []
      : deMoRaw.SendTo.length === 0
      ? []
      : deMoRaw.SendTo.map((sendToId) => {
          const user = props.users.find((user) => user.accountUserId === sendToId);
          return { email: user.email };
        });

    const generalData = {
      CurrencySymbol: tidyString(currResponse?.currency),
      ShowName: tidyString(props?.production?.ShowName),
      ProductionCompanyName: tidyString(props?.production?.ProductionCompany?.ProdCoName),
      ProductionCompanyVatNo: tidyString(props?.production?.ProductionCompany?.ProdCoVATCode),
      PDates: formatPerfs(props.contract.PerformanceTimes),
      HoldNotes: tidyString(deMoRaw?.OtherHolds), // needs changed to own field when fixed
      What3Words_Stage: tidyString(props?.venue?.AddressStageDoorW3W),
      What3Words_Loading: tidyString(props?.venue?.AddressLoadingW3W),
      Venue: {
        Name: tidyString(props?.venue?.Name),
        Phone: tidyString(primaryAddress?.Phone),
        Email: tidyString(primaryAddress?.Email),
        Programmer: {
          Name: `${tidyString(programmer?.FirstName)} ${tidyString(programmer?.LastName)}`,
          Email: tidyString(programmer?.Email),
        },
        BO_Manager: {
          Name: `${tidyString(boManager?.FirstName)} ${tidyString(boManager?.LastName)}`,
          Email: boManager?.Email,
        },
        Acc_Settlement: {
          Name: `${tidyString(accSettlment?.FirstName)} ${tidyString(accSettlment?.LastName)}`,
          Email: tidyString(accSettlment?.Email),
        },
        M_Manager: {
          Name: `${tidyString(marketManager?.FirstName)} ${tidyString(marketManager?.LastName)}`,
          Email: tidyString(marketManager?.Email),
          Phone: tidyString(marketManager?.Phone),
        },
        Tech_Manager: {
          Name: `${tidyString(techManager?.FirstName)} ${tidyString(techManager?.LastName)}`,
          Email: tidyString(techManager?.Email),
          Phone: tidyString(techManager?.Phone),
        },
        Capacity: tidyString(props?.venue?.Seats),
      },
      DeMo_PointOfContact: {
        Name: `${tidyString(deMoPoc?.AccContFirstName)} ${tidyString(deMoPoc?.AccContLastName)}`,
        Email: deMoPoc?.AccContMainEmail,
      },
      DM_CompanyContact: {
        Name: `${tidyString(companyPoc?.AccContFirstName)} ${tidyString(companyPoc?.AccContLastName)}`,
        Email: tidyString(companyPoc?.AccContMainEmail),
        Phone: tidyString(companyPoc?.AccContPhone),
      },
      SalesReportRecipients: salesRepEmails,
    };

    const toBeFormatted = {
      ...formatObjKeys(deMoRaw),
      TM_LONG_RunningTime: deMoRaw?.RunningTime,
      TM_TechArrivalTime: deMoRaw?.TechArrivalTime,
      TM_VenueCurfewTime: deMoRaw?.VenueCurfewTime,
      DT_DateIssued: deMoRaw?.DateIssued,
      DT_OnSaleDate: deMoRaw?.OnSaleDate,
      DT_BrochureDeadline: deMoRaw?.BrochureDeadline,
      DT_FinalProofBy: deMoRaw?.FinalProofBy,
      DT_TechArrivalDate: deMoRaw?.TechArrivalDate,
      DT_AdvancePaymentDueBy: deMoRaw?.AdvancePaymentDueBy,
      DealMemoCall:
        deMoRaw.DealMemoCall.length === 0
          ? [{ label: '' }]
          : deMoRaw.DealMemoCall.map((call) => {
              return {
                ...formatObjKeys(call),
                Label: numberToOrdinal(call.DMCCallNum + 1) + ' Call',
                DMCPromoterOrVenue: call.DMCPromoterOrVenue === 'p' ? 'Promoter' : 'Venue',
                DMCValue: call.DMCType === 'p' ? call.DMCValue + '%' : generalData?.CurrencySymbol + call?.DMCValue,
              };
            }),
      DealMemoHold:
        deMoRaw.DealMemoHold.length === 0
          ? [{ label: '' }]
          : deMoRaw.DealMemoHold.map((hold) => {
              return {
                ...formatObjKeys(hold),
                Label: holdTypes.find((type) => type.HoldTypeId === hold.DMHoldHoldTypeId).HoldTypeName,
                DMHoldValue:
                  generalData.CurrencySymbol + (hold.DMHoldValue === 0 ? '' : formatDecimalValue(hold.DMHoldValue)),
                DMHoldSeats: hold.DMHoldSeats === 0 ? '' : hold.DMHoldSeats,
              };
            }),
      DealMemoPrice: isUndefined(deMoRaw.DealMemoPrice)
        ? defaultPrice.map((price) => {
            return {
              ...price,
              DMPNumTickets: '',
              DMPTicketPrice: '',
            };
          })
        : deMoRaw.DealMemoPrice.map((price) => {
            return {
              ...price,
              DMPTicketPrice: formatDecimalValue(price.DMPTicketPrice),
            };
          }),
      SalesDay: deMoRaw.SalesDayNum ? days[deMoRaw.SalesDayNum] : '',
      WeeklySales: props.production.SalesFrequency === 'W',
    };

    const formattedData = formatTemplateObj(toBeFormatted);

    const strKeys = formatObjKeys(formattedData);
    const processedData = {
      ...strKeys,
      ...generalData,
    };

    // Need to include this so that Angular Expressions are supported
    const handler = new TemplateHandler({
      scopeDataResolver: createResolver({
        angularFilters: {
          upper: (input: string) => (input || '').toUpperCase(),
          lower: (input: string) => (input || '').toLowerCase(),
        },
      }),
    });

    const templateFile = await fetchTemplateDocument();
    const docx = await handler.process(templateFile, processedData);

    // get downloadable url from the blob
    const blobUrl = URL.createObjectURL(docx);

    // create temp link element
    let link = document.createElement('a');

    link.download = `Deal Memo ${props.production.ShowCode + props.production.Code} ${props.production.ShowName} ${
      props.venue.Name
    }.docx`;
    link.href = blobUrl;

    // use the link to invoke a download
    document.body.appendChild(link);
    link.click();

    // remove the link
    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      link = null;
    }, 0);
  }
};
