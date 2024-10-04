import axios from 'axios';
import { UserAcc } from 'components/contracts/modal/EditDealMemoContractModal';
import { parseAndSortDates } from 'components/contracts/utils';
import { days } from 'config/global';
import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { DealMemoHoldType, ProductionDTO } from 'interfaces';
import { isNullOrUndefined, numberToOrdinal } from 'utils';
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
const formatPerfs = (performances) => {
  const perfDays = parseAndSortDates(performances);
  return perfDays.map((perf) => {
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
    // const { data: deMoRaw } = await axios.get<DealMemoContractFormData>(`/api/deal-memo/read/${props.bookingId}`);
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
    const salesRepEmails = deMoRaw.SendTo.map((sendToId) => {
      const user = props.users.find((user) => user.accountUserId === sendToId);
      return { email: user.email };
    });
    const generalData = {
      CurrencySymbol: currResponse.currency,
      ShowName: props.production.ShowName,
      ProductionCompanyName: props.production.ProductionCompany.ProdCoName,
      ProductionCompanyVatNo: props.production.ProductionCompany.ProdCoVATCode,
      PDates: formatPerfs(props.contract.PerformanceTimes),
      HoldNotes: deMoRaw.OtherHolds, // needs changed to own field when fixed
      What3Words_Stage: props.venue.AddressStageDoorW3W,
      What3Words_Loading: props.venue.AddressLoadingW3W,
      Venue: {
        Name: props.venue.Name,
        Phone: primaryAddress.Phone,
        Email: primaryAddress.Email,
        Programmer: {
          Name: `${programmer.FirstName} ${programmer.LastName}`,
          Email: programmer.Email,
        },
        BO_Manager: {
          Name: `${boManager.FirstName} ${boManager.LastName}`,
          Email: boManager.Email,
        },
        Acc_Settlement: {
          Name: `${accSettlment.FirstName} ${accSettlment.LastName}`,
          Email: accSettlment.Email,
        },
        M_Manager: {
          Name: `${marketManager.FirstName} ${marketManager.LastName}`,
          Email: marketManager.Email,
          Phone: marketManager.Phone,
        },
        Tech_Manager: {
          Name: `${techManager.FirstName} ${techManager.LastName}`,
          Email: techManager.Email,
          Phone: techManager.Phone,
        },
        Capacity: props.venue.Seats,
      },
      DeMo_PointOfContact: {
        Name: `${deMoPoc.AccContFirstName} ${deMoPoc.AccContLastName}`,
        Email: deMoPoc.AccContMainEmail,
      },
      DM_CompanyContact: {
        Name: `${companyPoc.AccContFirstName} ${companyPoc.AccContLastName}`,
        Email: companyPoc.AccContMainEmail,
        Phone: companyPoc.AccContPhone,
      },
      SalesReportRecipients: salesRepEmails,
    };
    const toBeFormatted = {
      ...formatObjKeys(deMoRaw),
      TM_LONG_RunningTime: deMoRaw.RunningTime,
      TM_TechArrivalTime: deMoRaw.TechArrivalTime,
      TM_VenueCurfewTime: deMoRaw.VenueCurfewTime,
      DT_DateIssued: deMoRaw.DateIssued,
      DT_OnSaleDate: deMoRaw.OnSaleDate,
      DT_BrochureDeadline: deMoRaw.BrochureDeadline,
      DT_FinalProofBy: deMoRaw.FinalProofBy,
      DT_TechArrivalDate: deMoRaw.TechArrivalDate,
      DT_AdvancePaymentDueBy: deMoRaw.AdvancePaymentDueBy,
      DealMemoCall: deMoRaw.DealMemoCall.map((call) => {
        return {
          ...formatObjKeys(call),
          Label: numberToOrdinal(call.DMCCallNum + 1) + ' Call',
          DMCPromoterOrVenue: call.DMCPromoterOrVenue === 'p' ? 'Promoter' : 'Venue',
          DMCValue: call.DMCType === 'p' ? call.DMCValue + '%' : generalData.CurrencySymbol + call.DMCValue,
        };
      }),
      DealMemoHold: deMoRaw.DealMemoHold.map((hold) => {
        return {
          ...formatObjKeys(hold),
          Label: holdTypes.find((type) => type.HoldTypeId === hold.DMHoldHoldTypeId).HoldTypeName,
          DMHoldValue: generalData.CurrencySymbol + hold.DMHoldValue,
        };
      }),
      SalesDay: days[deMoRaw.SalesDayNum],
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
    link.download = 'Deal_Memo.docx';
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
