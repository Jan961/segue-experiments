export const upsertAddress = async (addressId: number, addressDetails, tx) => {
  const { address1, address2, address3, postcode, town, country } = addressDetails;

  const addressData = {
    Address1: address1,
    Address2: address2,
    Address3: address3,
    AddressPostcode: postcode,
    AddressTown: town,
    ...(country && {
      Country: {
        connect: {
          Id: country,
        },
      },
    }),
  };

  // Update or create an address record
  const address = await tx.address.upsert({
    where: { AddressId: addressId || 0 }, // Create new if no addressId
    update: addressData,
    create: addressData,
  });

  return address;
};
