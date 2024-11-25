import { Account } from 'prisma/generated/prisma-master';
import { newDate } from 'services/dateService';

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
    organisationId: account.AccountOrganisationId,
    termsAgreedBy: account.AccountTermsAgreedBy,
    termsAgreedDate: account.AccountTermsAgreedDate,
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
    AccountOrganisationId: account.organisationId,
    AccountTermsAgreedBy: account.email,
    AccountTermsAgreedDate: newDate(),
    // Dummy default PIN
    AccountPIN: 'XXXXX',
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

export const mapAccountContactFromPrismaFields = (accountContact: any) => {
  return {
    contactId: accountContact.AccContId,
    accountId: accountContact.AccContAccountId,
    firstName: accountContact.AccContFirstName,
    lastName: accountContact.AccContLastName,
    phoneNumber: accountContact.AccContPhone,
    email: accountContact.AccContMainEmail,
  };
};
