import { PersonMinimalDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { Person } from 'prisma/generated/prisma-client';
import { isUndefined } from 'utils';

interface AddressDetails {
  address1?: string;
  address2?: string;
  address3?: string;
  town?: string;
  postcode?: string;
  country?: number | null;
}

export const prepareAddressQueryData = (addressDetails: AddressDetails | null) => {
  if (!addressDetails) return null;

  const { address1, address2, address3, town, postcode, country } = addressDetails;

  const addressData: any = {};

  if (!isUndefined(address1)) {
    addressData.Address1 = address1;
  }
  if (!isUndefined(address2)) {
    addressData.Address2 = address2;
  }
  if (!isUndefined(address3)) {
    addressData.Address3 = address3;
  }
  if (!isUndefined(town)) {
    addressData.AddressTown = town;
  }
  if (!isUndefined(postcode)) {
    addressData.AddressPostcode = postcode;
  }
  if (!isUndefined(country)) {
    if (country === null) {
      addressData.Country = {
        disconnect: true,
      };
    } else {
      addressData.Country = {
        connect: { Id: country },
      };
    }
  }

  return addressData;
};

interface OrganisationDetails {
  name?: string;
  website?: string;
}

export const prepareOrganisationQueryData = (
  orgDetails: OrganisationDetails | null,
  contactPersonId?: number | null,
) => {
  if (!orgDetails) return null;

  const { name, website } = orgDetails;

  const organisationData: any = {};

  if (!isUndefined(name)) {
    organisationData.OrgName = name;
  }

  if (!isUndefined(website)) {
    organisationData.OrgWebsite = website;
  }

  if (!isUndefined(contactPersonId)) {
    if (contactPersonId === null) {
      organisationData.OrgContactPersonId = {
        disconnect: true,
      };
    } else {
      organisationData.OrgContactPersonId = {
        connect: { PersonId: contactPersonId },
      };
    }
  }

  return organisationData;
};

interface PersonPersonDetails {
  mainPersonId?: number;
  relatedPersonId?: number;
  roleName?: string;
}

export const preparePersonPersonQueryData = ({ mainPersonId, relatedPersonId, roleName }: PersonPersonDetails) => {
  if (isUndefined(mainPersonId) || isUndefined(relatedPersonId) || isUndefined(roleName)) {
    return null;
  }

  const personPersonData: any = {};

  if (!isUndefined(mainPersonId)) {
    personPersonData.PPPersonId = mainPersonId;
  }

  if (!isUndefined(relatedPersonId)) {
    personPersonData.PPPersonRoleId = relatedPersonId;
  }

  if (!isUndefined(roleName)) {
    personPersonData.PersonRoleType = roleName;
  }

  return personPersonData;
};

interface AccountDetails {
  paidTo?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  swift?: string;
  iban?: string;
  country?: number | null;
}

interface PersonDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  landline?: string;
  mobileNumber?: string;
  passportName?: string;
  passportExpiryDate?: string | null;
  hasUKWorkPermit?: number;
  isFEURequired?: number;
  notes?: string;
  healthDetails?: string;
  advisoryNotes?: string;
  workTypes?: number[];
  otherWorkTypes?: string[];
}

export const preparePersonQueryData = (
  personDetails: PersonDetails,
  addressId?: number | null,
  organisationId?: number | null,
  salaryAccountDetails?: AccountDetails,
  expenseAccountDetails?: AccountDetails,
) => {
  if (!personDetails) return null;

  const {
    firstName,
    lastName,
    email,
    landline,
    mobileNumber,
    passportName,
    passportExpiryDate,
    hasUKWorkPermit,
    isFEURequired,
    notes,
    healthDetails,
    advisoryNotes,
    workTypes,
    otherWorkTypes,
  } = personDetails;

  const personData: any = {};

  if (!isUndefined(firstName)) {
    personData.PersonFirstName = firstName;
  }
  if (!isUndefined(lastName)) {
    personData.PersonLastName = lastName;
  }
  if (!isUndefined(email)) {
    personData.PersonEmail = email;
  }
  if (!isUndefined(landline)) {
    personData.PersonPhone = landline;
  }
  if (!isUndefined(mobileNumber)) {
    personData.PersonMobile = mobileNumber;
  }
  if (!isUndefined(passportName)) {
    personData.PersonPassportName = passportName;
  }
  if (!isUndefined(passportExpiryDate)) {
    personData.PersonPassportExpiryDate = passportExpiryDate ? new Date(passportExpiryDate) : null;
  }
  if (!isUndefined(hasUKWorkPermit)) {
    personData.PersonEligibleToWork = hasUKWorkPermit === 1;
  }
  if (!isUndefined(isFEURequired)) {
    personData.PersonFEURequired = isFEURequired === 1;
  }
  if (!isUndefined(notes)) {
    personData.PersonNotes = notes;
  }
  if (!isUndefined(healthDetails)) {
    personData.PersonHealthNotes = healthDetails;
  }
  if (!isUndefined(advisoryNotes)) {
    personData.PersonAdvisoryNotes = advisoryNotes;
  }

  if (!isUndefined(addressId)) {
    if (addressId === null) {
      personData.Address = {
        disconnect: true,
      };
    } else {
      personData.Address = {
        connect: { AddressId: addressId },
      };
    }
  }

  if (!isUndefined(organisationId)) {
    if (organisationId === null) {
      personData.Organisation_Person_PersonAgencyOrgIdToOrganisation = {
        disconnect: true,
      };
    } else {
      personData.Organisation_Person_PersonAgencyOrgIdToOrganisation = {
        connect: { OrgId: organisationId },
      };
    }
  }

  if (workTypes && workTypes.length > 0) {
    personData.PersonPersonRole = {
      create: workTypes.map((workTypeId) => ({
        PersonRole: {
          connect: {
            PersonRoleId: workTypeId,
          },
        },
      })),
    };
  }
  if (otherWorkTypes && otherWorkTypes.length > 0) {
    personData.PersonOtherRole = {
      create: otherWorkTypes.map((roleName) => ({
        PORName: roleName,
      })),
    };
  }

  // Handle salaryAccountDetails
  if (salaryAccountDetails) {
    const { paidTo, accountName, accountNumber, sortCode, swift, iban, country } = salaryAccountDetails;

    if (!isUndefined(paidTo)) {
      personData.PersonPaymentTo = paidTo;
    }
    if (!isUndefined(accountName)) {
      personData.PersonPaymentAccount = accountName;
    }
    if (!isUndefined(accountNumber)) {
      personData.PersonPaymentAccount = accountNumber;
    }
    if (!isUndefined(sortCode)) {
      personData.PersonPaymentSortCode = sortCode;
    }
    if (!isUndefined(swift)) {
      personData.PersonPaymentSWIFTBIC = swift;
    }
    if (!isUndefined(iban)) {
      personData.PersonPaymentIBAN = iban;
    }
    if (!isUndefined(country)) {
      if (country === null) {
        personData.Country_Person_PersonPaymentBankCountryIdToCountry = {
          disconnect: true,
        };
      } else {
        personData.Country_Person_PersonPaymentBankCountryIdToCountry = {
          connect: { Id: country },
        };
      }
    }
  }

  // Handle expenseAccountDetails
  if (expenseAccountDetails) {
    const { paidTo, accountName, accountNumber, sortCode, swift, iban, country } = expenseAccountDetails;

    if (!isUndefined(paidTo)) {
      personData.PersonExpensesTo = paidTo;
    }
    if (!isUndefined(accountName)) {
      personData.PersonExpensesAccount = accountName;
    }
    if (!isUndefined(accountNumber)) {
      personData.PersonExpensesAccount = accountNumber;
    }
    if (!isUndefined(sortCode)) {
      personData.PersonExpensesSortCode = sortCode;
    }
    if (!isUndefined(swift)) {
      personData.PersonExpensesSWIFTBIC = swift;
    }
    if (!isUndefined(iban)) {
      personData.PersonExpensesIBAN = iban;
    }
    if (!isUndefined(country)) {
      if (country === null) {
        personData.Country_Person_PersonExpensesBankCountryIdToCountry = {
          disconnect: true,
        };
      } else {
        personData.Country_Person_PersonExpensesBankCountryIdToCountry = {
          connect: { Id: country },
        };
      }
    }
  }

  return personData;
};

export const fetchAllMinPersonsList = async (): Promise<PersonMinimalDTO[]> => {
  const persons: Person[] = await prisma.Person.findMany({
    select: {
      PersonFirstName: true,
      PersonLastName: true,
      PersonEmail: true,
    },
  });
  console.table(persons);
  return persons.map((person) => ({
    id: person.PersonId ?? null,
    firstName: person.PersonFirstName ?? '',
    lastName: person.PersonLastName ?? '',
    email: person.PersonEmail ?? '',
  }));
};
