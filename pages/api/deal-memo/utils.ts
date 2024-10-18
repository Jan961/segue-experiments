import { isNullOrEmpty } from 'utils';

export const getPrice = (dealMemoPrice) => {
  const priceData = [...dealMemoPrice.custom, ...dealMemoPrice.default];
  const processedPrice = [];

  priceData.forEach((priceRec) => {
    const price = {
      ...priceRec,
      DMPTicketPrice: priceRec.DMPTicketPrice === '' ? 0 : parseFloat(priceRec.DMPTicketPrice),
    };
    delete price.DMPId;
    delete price.DMPDeMoId;

    // only process price if DMPTicketName is not blank
    if (!isNullOrEmpty(price.DMPTicketName)) {
      processedPrice.push(price);
    }
  });

  return processedPrice;
};

export const getDealMemoCall = (dealMemoCall) => {
  const processedCalls = [];

  dealMemoCall.forEach((callRec) => {
    const call = { ...callRec };
    delete call.DMCDeMoId;

    processedCalls.push(call);
  });

  return processedCalls;
};

export const getDealMemoHoldUpdQuery = (dealMemoHold) => {
  const dmHoldUpdate = [];

  if (dealMemoHold && dealMemoHold.length > 0) {
    dealMemoHold.forEach((hold) => {
      if (hold.DMHoldDeMoId) {
        const updHold = {
          where: { DMHoldId: hold.DMHoldId },
          data: { ...hold, DMHoldSeats: parseInt(hold.DMHoldSeats), DMHoldValue: parseFloat(hold.DMHoldValue) },
        };
        dmHoldUpdate.push(updHold);
      }
    });
  }

  return dmHoldUpdate;
};

export const getContactIdData = (dealMemo) => {
  if (dealMemo.BOMVenueContactId) {
    dealMemo.VenueContact_DealMemo_DeMoBOMVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.BOMVenueContactId },
    };
  }

  if (dealMemo.TechVenueContactId) {
    dealMemo.VenueContact_DealMemo_DeMoTechVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.TechVenueContactId },
    };
  }
  return dealMemo;
};
