import { transformAccountDetails, transformOrganisationDetails, transformPersonDetails } from './contracts';

export const transformPersonWithRoles = (person) => {
  const emergencyContacts = person?.PersonPerson_PersonPerson_PPPersonIdToPerson?.reduce?.((contacts, personPerson) => {
    if (personPerson.PPRoleType === 'emergencycontact') {
      contacts.push({ ...personPerson.Person_PersonPerson_PPRolePersonIdToPerson, id: personPerson.PPId });
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

  const contact1 = transformPersonDetails(emergencyContacts?.[0]);
  const contact2 = transformPersonDetails(emergencyContacts?.[1]);
  const personDetails = {
    personDetails: transformPersonDetails(person),
    agencyDetails: transformOrganisationDetails(person.Organisation_Person_PersonAgencyOrgIdToOrganisation),
    salaryAccountDetails: transformAccountDetails(person),
    expenseAccountDetails: expensesAccountDetails,
    emergencyContact1: { ...(contact1 || {}), id: emergencyContacts?.[0]?.id, personId: contact1?.id },
    emergencyContact2: { ...(contact2 || {}), id: emergencyContacts?.[1]?.id, personId: contact2?.id },
  };

  return personDetails;
};
