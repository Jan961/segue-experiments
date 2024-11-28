import axios from 'axios';
import { UserAcc } from 'components/contracts/modal/EditVenueContractModal';
import { defaultPrice, filterPrice, parseAndSortDates } from 'components/contracts/utils';
import { days } from 'config/global';
import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { DealMemoHoldType, ProductionDTO } from 'interfaces';
import {
  formatDecimalValue,
  getSegueMicroServiceUrl,
  isNullOrEmpty,
  isNullOrUndefined,
  isUndefined,
  numberToOrdinal,
  tidyString,
} from 'utils';
import { formatTemplateObj } from 'utils/templateExport';

type ExportType = 'pdf' | 'docx';

type DeMoExportProps = {
  bookingId: string;
  production: Partial<ProductionDTO>;
  contract: any;
  venue: any;
  accContacts: any;
  users: Array<UserAcc>;
  dealMemoData?: any;
  fileType: ExportType;
};

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
      `/api/file/download?location=${'https://d1e9vbizioozy0.cloudfront.net/contracts/templates/DealMemo_v1.1.7.docx'}`,
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

const processPriceData = (priceData) => {
  let result = [];
  if (isUndefined(priceData)) {
    result = defaultPrice.map((price) => {
      return {
        ...price,
        DMPNumTickets: '',
        DMPTicketPrice: '',
      };
    });
  } else {
    const pricesJoined = [...priceData.default, ...priceData.custom].filter(
      (price) => !isNullOrEmpty(price.DMPTicketName),
    );
    result = pricesJoined.map((price) => {
      return {
        ...price,
        DMPTicketPrice: formatDecimalValue(price.DMPTicketPrice),
      };
    });
  }

  return result;
};

const prepareFile = async (processedData, fileType: ExportType) => {
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

  switch (fileType) {
    case 'docx': {
      return docx;
    }

    case 'pdf': {
      try {
        const tokenresponse = await axios.post('/api/pdfconvert/token/create/');
        const convertFormData = new FormData();
        convertFormData.append('token', String(tokenresponse.data.token));
        convertFormData.append('file', docx);

        const docToPdfEndpoint = getSegueMicroServiceUrl('/convertDocxToPDF');

        const response = await axios.post(docToPdfEndpoint, convertFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        });

        const pdf = new Blob([response.data], { type: 'application/pdf' });
        return pdf;
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export const dealMemoExport = async (props: DeMoExportProps) => {
  if (!isNullOrUndefined(props.bookingId)) {
    const { data: currResponse } = await axios.get(`/api/marketing/currency/booking/${props.bookingId}`);
    const { data: holdTypes } = await axios.get<Array<DealMemoHoldType>>(`/api/deal-memo/hold-type/read`);

    // if dealMemoData is undfefined, get the data from the database
    // this is to reduce latency when the user clicks - 'save, close and export'
    let deMoRaw = props.dealMemoData;
    if (isNullOrUndefined(deMoRaw)) {
      const { data } = await axios.get(`/api/deal-memo/read/${props.bookingId}`);
      const priceData = filterPrice(data.DealMemoPrice);
      deMoRaw = { ...data, DealMemoPrice: priceData };
    }

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
      LaundryFacilities: [
        deMoRaw.NumFacilitiesLaundry ? 'Washer' : null,
        deMoRaw.NumFacilitiesDrier ? 'Dryer' : null,
        deMoRaw.NumFacilitiesLaundryRoom ? 'Laundry Room' : null,
      ]
        .filter(Boolean)
        .join(', '),
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
      DealMemoPrice: processPriceData(deMoRaw.DealMemoPrice),
      SalesDay: deMoRaw.SalesDayNum ? days[deMoRaw.SalesDayNum] : '',
      WeeklySales: props.production.SalesFrequency === 'W',
      DEC_ROTTPercentage: deMoRaw.ROTTPercentage,
      DEC_VenueRental: deMoRaw.VenueRental,
      DEC_StaffingContra: deMoRaw.StaffingContra,
      DEC_AgreedContraItems: deMoRaw.AgreedContraItems,
      DEC_RestorationLevy: deMoRaw.RestorationLevy,
      DEC_BookingFees: deMoRaw.BookingFees,
      DEC_TxnChargeAmount: deMoRaw.TxnChargeAmount,
      DEC_LocalMarketingBudget: deMoRaw.LocalMarketingBudget,
      DEC_LocalMarketingContra: deMoRaw.LocalMarketingContra,
      DEC_SellPitchFee: deMoRaw.SellPitchFee,
    };

    const formattedData = formatTemplateObj(toBeFormatted);

    const strKeys = formatObjKeys(formattedData);

    const processedData = {
      ...strKeys,
      ...generalData,
    };

    const exportFile = await prepareFile(processedData, props.fileType);

    // get downloadable url from the blob
    const blobUrl = URL.createObjectURL(exportFile);

    // create temp link element
    let link = document.createElement('a');

    link.download = `Deal Memo ${props.production.ShowCode + props.production.Code} ${props.production.ShowName} ${
      props.venue.Name
    }.${props.fileType}`;
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
