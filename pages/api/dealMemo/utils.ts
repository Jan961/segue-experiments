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

export const getDealMemoHold = (dealMemoHold, demoId) => {
  const updateHold = [];
  const createHold = [];
  if (dealMemoHold && dealMemoHold.length > 0) {
    dealMemoHold.forEach((hold) => {
      if (hold.DMHoldDeMoId) {
        const holdData = {
          DMHoldValue: hold.value ? parseInt(hold.value) : 0,
          DMHoldSeats: hold.seats ? parseInt(hold.seats) : 0,
          DMHoldHoldTypeId: hold.HoldTypeId,
        };
        const price = {
          where: { DMHoldHoldTypeId: hold.HoldTypeId, DMHoldDeMoId: demoId },
          data: holdData,
        };
        updateHold.push(price);
      } else {
        const holdData = {
          DMHoldValue: hold.value ? parseInt(hold.value) : 0,
          DMHoldSeats: hold.seats ? parseInt(hold.seats) : 0,
          DMHoldHoldTypeId: hold.HoldTypeId,
        };

        createHold.push(holdData);
      }
    });
  }

  return [updateHold, createHold];
};

export const getContactIdData = (dealMemo) => {
  if (dealMemo.BOMVenueContactId) {
    dealMemo.VenueContact_DealMemo_BOMVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.BOMVenueContactId },
    };
  }

  if (dealMemo.TechVenueContactId) {
    dealMemo.VenueContact_DealMemo_TechVenueContactIdToVenueContact = {
      connect: { Id: dealMemo.TechVenueContactId },
    };
  }
  return dealMemo;
};
