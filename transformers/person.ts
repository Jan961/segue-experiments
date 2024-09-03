import { transformAccountDetails, transformOrganisationDetails, transformPersonDetails } from './contracts';

export const transformPersonWithRoles = (person) => {
  const emergencyContacts = person?.PersonPerson_PersonPerson_PPPersonIdToPerson?.reduce?.((contacts, personPerson) => {
    if (personPerson.PPRoleType === 'emergencycontact') {
      contacts.push(personPerson.Person_PersonPerson_PPRolePersonIdToPerson);
    }
    return contacts;
  }, []);

  const expensesAccountDetails = {
    paidTo: person.PersonExpensesTo || null,
    accountName: person.PersonExpensesAccountName || '',
    accountNumber: person.PersonExpensesAccount || '',
    sortCode: person.PersonExpensesSortCode || '',
    swift: person.PersonExpensesSWIFTBIC || '',
    iban: person.PersonExpensesIBAN || '',
    country: person.PersonExpensesBankCountryId || null,
  };

  const personDetails = {
    personDetails: transformPersonDetails(person),
    agencyDetails: transformOrganisationDetails(person.Organisation_Person_PersonAgencyOrgIdToOrganisation),
    salaryAccountDetails: transformAccountDetails(person),
    expenseAccountDetails: expensesAccountDetails,
    emergencyContact1: transformPersonDetails(emergencyContacts?.[0]),
    emergencyContact2: transformPersonDetails(emergencyContacts?.[1]),
  };

  return personDetails;
};
