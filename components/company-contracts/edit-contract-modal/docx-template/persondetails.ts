import { IPerson } from 'components/contracts/types';

export const getPersonDetailsTags = (personDetailsData: IPerson) => {
  return {
    ...getDefinedPersonDetails(personDetailsData),
    ...getCompositePersonDetails(personDetailsData),
  };
};

// Function to map all of the data from the Person Details forms to tags
const getDefinedPersonDetails = (personDetailsData: IPerson) => {
  const mapValuesToKeys = (obj: any, defaults: Record<string, string>) => {
    return Object.entries(defaults).reduce(
      (acc, [key, defaultKey]) => {
        acc[defaultKey] = (obj as any)?.[key] ?? ''; // ADD:  "(obj as any)?.[key] ?? defaultKey;" if you want blank values to have a default
        return acc;
      },
      {} as Record<string, string>,
    );
  };

  const personDetailsDefaults = {
    firstName: 'PERSONFIRSTNAME',
    lastName: 'PERSONLASTNAME',
    email: 'PERSONEMAILADDRESS',
    landline: 'PERSONLANDLINE',
    address1: 'PERSONADDRESS1',
    address2: 'PERSONADDRESS2',
    address3: 'PERSONADDRESS3',
    town: 'PERSONTOWN',
    mobileNumber: 'PERSONMOBILENUMBER',
    passportName: 'PERSONPASSPORTNAME',
    passportNumber: 'PERSONPASSPORTNUMBER',
    passportExpiryDate: 'PERSONPASSPORTEXPIRYDATE',
    hasUKWorkPermit: 'PERSONHASUKWORKPERMIT',
    postcode: 'PERSONPOSTCODE',
    checkedBy: 'PERSONPASSPORTCHECKEDBY',
    country: 'PERSONCOUNTRY',
    isFEURequired: 'PERSONISFEUREQUIRED',
    advisoryNotes: 'PERSONADVISORYNOTES',
    generalNotes: 'PERSONGENERALNOTES',
    healthDetails: 'PERSONHEALTHDETAILS',
    notes: 'PERSONNOTES',
  };

  const emergencyContactDefaults = {
    firstName: 'EC1FIRSTNAME',
    lastName: 'EC1LASTNAME',
    address1: 'EC1ADDRESS1',
    address2: 'EC1ADDRESS2',
    address3: 'EC1ADDRESS3',
    town: 'EC1TOWN',
    postcode: 'EC1POSTCODE',
    country: 'EC1COUNTRY',
    email: 'EC1EMAILADDRESS',
    landline: 'EC1LANDLINE',
    mobileNumber: 'EC1MOBILENUMBER',
  };

  const agencyDetailsDefaults = {
    firstName: 'AGENTFIRSTNAME',
    lastName: 'AGENTLASTNAME',
    email: 'AGENCYEMAILADDRESS',
    landline: 'AGENCYLANDLINE',
    address1: 'AGENCYADDRESS1',
    address2: 'AGENCYADDRESS2',
    address3: 'AGENCYADDRESS3',
    name: 'AGENCYNAME',
    mobileNumber: 'AGENCYMOBILENUMBER',
    website: 'AGENCYWEBSITE',
    town: 'AGENCYTOWN',
    postcode: 'AGENCYPOSTCODE',
    country: 'AGENCYCOUNTRY',
  };

  const salaryAccountDefaults = {
    paidTo: 'SALARYPAIDTO',
    accountName: 'SALARYACCOUNTNAME',
    accountNumber: 'SALARYACCOUNTNUMBER',
    sortCode: 'SALARYSORTCODE',
    swift: 'SALARYSWIFT',
    iban: 'SALARYIBAN',
    country: 'SALARYCOUNTRY',
  };

  const expenseAccountDefaults = {
    paidTo: 'EXPENSEPAIDTO',
    accountName: 'EXPENSEACCOUNTNAME',
    accountNumber: 'EXPENSEACCOUNTNUMBER',
    sortCode: 'EXPENSESORTCODE',
    swift: 'EXPENSESWIFT',
    iban: 'EXPENSEIBAN',
    country: 'EXPENSECOUNTRY',
  };

  return {
    ...mapValuesToKeys(personDetailsData.personDetails, personDetailsDefaults),
    ...mapValuesToKeys(personDetailsData.emergencyContact1, emergencyContactDefaults),
    ...mapValuesToKeys(personDetailsData.agencyDetails, agencyDetailsDefaults),
    ...mapValuesToKeys(personDetailsData.salaryAccountDetails, salaryAccountDefaults),
    ...mapValuesToKeys(personDetailsData.expenseAccountDetails, expenseAccountDefaults),
  };
};

// Function to create composite tags based on the data from the Person Details form such
const getCompositePersonDetails = (personDetailsData: IPerson) => {
  return {
    ...getPersonFullName(personDetailsData),
  };
};

const getPersonFullName = (personDetailsData: IPerson) => {
  const firstName = personDetailsData.personDetails?.firstName || '';
  const lastName = personDetailsData.personDetails?.lastName || '';
  return {
    PERSONFULLNAME: `${firstName} ${lastName}`,
  };
};
