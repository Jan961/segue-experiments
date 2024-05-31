import { Account } from '@prisma/client';

export const mapAccountFromPrismaFields = (account: Account) => {
  return {
    accountId: account.AccountId,
    companyName: account.AccountName,
    email: account.AccountMainEmail,
    currency: account.AccountCurrencyCode,
    addressLine1: account.AccountAddress1,
    addressLine2: account.AccountAddress2,
    addressLine3: account.AccountAddress3,
    town: account.AccountAddressTown,
    county: account.AccountAddressCounty,
    postcode: account.AccountAddressPostcode,
    country: account.AccountAddressCountry,
  };
};

export const mapToAccountPrismaFields = (account: any) => {
  return {
    AccountId: account.accountId || null,
    AccountName: account.companyName,
    AccountMainEmail: account.email,
    AccountCurrencyCode: account.currency,
    AccountAddress1: account.addressLine1,
    AccountAddress2: account.addressLine2,
    AccountAddress3: account.addressLine3,
    AccountAddressTown: account.town,
    AccountAddressCounty: account.county,
    AccountAddressPostcode: account.postcode,
    AccountAddressCountry: account.country,
  };
};

export const mapToAccountContactPrismaFields = (account: any) => {
  return {
    AccContId: account.contactId || null,
    AccContAccountId: account.accountId,
    AccContFirstName: account.firstName,
    AccContLastName: account.lastName,
    AccContPhone: account.phoneNumber,
    AccContMainEmail: account.email,
  };
};
