declare global {
  interface BankAccount {
    paidTo: string | null;
    accountName: string;
    accountNumber: string;
    sortCode: string;
    swift?: string;
    iban?: string;
    country: number | null;
  }

  interface AgencyDetails {
    firstName: string;
    lastName: string;
    email: string;
    landline: string;
    address1: string;
    address2: string;
    address3: string;
    name: string;
    mobileNumber: string;
    website: string;
    town: string;
    postcode: string;
    country: number | null;
  }

  interface EmergencyContact {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    address3?: string;
    town: string;
    postcode: string;
    country: number | null;
    email: string;
    landline: string;
    mobileNumber: string;
  }

  interface PersonDetails {
    firstName: string;
    lastName: string;
    email: string;
    landline: string;
    address1: string;
    address2: string;
    address3: string;
    town: string;
    mobileNumber: string;
    passportName: string;
    passportNumber: string;
    hasUKWorkPermit: boolean | null;
    passportExpiryDate: string | null;
    postcode: string;
    checkedBy: number | null;
    country: number | null;
    isFEURequired: boolean | null;
    workType: number[];
    advisoryNotes: string;
    generalNotes: string;
    healthDetails: string;
    otherWorkTypes: string[];
    notes: string;
  }
}

type ContractSchedule = {
  production: string | null;
  department: string | null;
  role: string;
  personId: number | null;
  templateId: number | null;
};
