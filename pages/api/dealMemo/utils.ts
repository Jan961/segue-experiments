export const getPrice = (dealMemoPrice) => {
  const updatePrice = [];
  const createPrice = [];
  dealMemoPrice.forEach((priceData) => {
    if (priceData.DMPId) {
      const price = {
        where: { DMPId: priceData.DMPId },
        data: priceData,
      };
      delete price.data.DMPId;
      delete price.data.DMPDeMoId;
      updatePrice.push(price);
    } else {
      delete priceData.DMPDeMoId;
      createPrice.push(priceData);
    }
  });
  return [updatePrice, createPrice];
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
    if (memoCall.DMCDeMoId) {
      const price = {
        where: { DMCDeMoId: memoCall.DMCDeMoId },
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

export const getDealMemoHold = (dealMemoHold) => {
  const updateHold = [];
  const createHold = [];

  dealMemoHold.forEach((hold) => {
    if (hold.DMHoldDeMoId) {
      const price = {
        where: { DMHoldDeMoId: hold.DMHoldDeMoId },
        data: hold,
      };
      delete price.data.DMHoldDeMoId;
      updateHold.push(price);
    } else {
      delete hold.DMHoldDeMoId;
      createHold.push(hold);
    }
  });
  return [updateHold, createHold];
};

export const getContactIdData = (dealMemo) => {
  if (dealMemo.DeMoBOMVenueContactId) {
    dealMemo.VenueContact_DealMemo_DeMoBOMVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.DeMoBOMVenueContactId },
    };
  }

  if (dealMemo.DeMoTechVenueContactId) {
    dealMemo.VenueContact_DealMemo_DeMoTechVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.DeMoTechVenueContactId },
    };
  }
  return dealMemo;
};
