export interface UiAccount {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  townName?: string;
  postcode: string;
  country: string;
  companyEmail: string;
  currencyForPayment: string;
  vatNumber?: string;
  companyNumber?: string;
  companyWebsite?: string;
  typeOfCompany?: string;
  currency: string;
}

export type UiAccountType = UiAccount;

export const initialUiAccountDetails = {
  firstName: '',
  lastName: '',
  companyName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  townName: '',
  postcode: '',
  country: '',
  companyEmail: '',
  currencyForPayment: '',
  vatNumber: '',
  companyNumber: '',
  companyWebsite: '',
  typeOfCompany: '',
  currency: '',
};
