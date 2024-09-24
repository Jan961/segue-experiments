export const getPrice = (dealMemoPrice) => {
  const updatePrice = [];
  const createPrice = [];

  const priceData = [...dealMemoPrice.custom, ...dealMemoPrice.default];

  priceData.forEach((priceRec) => {
    if (priceRec.DMPId) {
      const price = {
        where: { DMPId: priceRec.DMPId },
        data: { ...priceRec, DMPTicketPrice: priceRec.DMPTicketPrice === '' ? 0 : parseFloat(priceRec.DMPTicketPrice) },
      };
      delete price.data.DMPId;
      delete price.data.DMPDeMoId;
      updatePrice.push(price);
    } else {
      delete priceRec.DMPDeMoId;
      createPrice.push({
        ...priceRec,
        DMPTicketPrice: priceRec.DMPTicketPrice === '' ? 0 : parseFloat(priceRec.DMPTicketPrice),
      });
    }
  });

  return { create: createPrice, update: updatePrice };
};

export const getTechProvision = (techProvision) => {
  const updateTechProvision = [];
  const createTechProvision = [];

  techProvision.forEach((tech) => {
    if (tech.DMTechDeMoId) {
      const provision = {
        where: { DMTechDeMoId: tech.DMTechDeMoId },
        data: tech,
      };
      delete provision.data.DMTechDeMoId;
      updateTechProvision.push(provision);
    } else {
      createTechProvision.push(tech);
    }
  });
  return [updateTechProvision, createTechProvision];
};

export const getDealMemoCall = (dealMemoCall) => {
  const updateCall = [];
  const createCall = [];

  dealMemoCall.forEach((memoCall) => {
    if (memoCall.DMCId) {
      const price = {
        where: { DMCId: memoCall.DMCId },
        data: memoCall,
      };
      delete price.data.DMCDeMoId;
      updateCall.push(price);
    } else {
      delete memoCall.DMCDeMoId;
      createCall.push(memoCall);
    }
  });
  return [updateCall, createCall];
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
