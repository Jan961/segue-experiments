export const upsertAddress = async (addressId: number, addressDetails, tx) => {
  const { address1, address2, address3, postcode, town, country } = addressDetails;

  const addressData = {
    Address1: address1 || null,
    Address2: address2 || null,
    Address3: address3 || null,
    AddressPostcode: postcode || null,
    AddressTown: town || null,
    ...(country && {
      Country: {
        connect: {
          Id: country,
        },
      },
    }),
  };

  return await tx.address.upsert({
    where: { AddressId: addressId || 0 },
    update: addressData,
    create: addressData,
  });
};
