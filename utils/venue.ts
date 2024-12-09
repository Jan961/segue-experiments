import { Venue, VenueAddress, VenueBarredVenue, VenueContact, VenueRole } from 'prisma/generated/prisma-client';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import fileInterface from './fileInterface';
import { isUndefined } from 'utils';

export interface PrimaryAddress {
  primaryAddressId?: number;
  primaryAddress1?: string;
  primaryAddress2?: string;
  primaryAddress3?: string;
  primaryCountry?: number;
  primaryTown?: string;
  primaryPostCode?: string;
  primaryPhoneNumber?: string;
  primaryEMail?: string;
  what3WordsEntrance?: string;
  primaryCoordinates?: { latitude: null; longitude: null };
}

export interface DeliveryAddress {
  deliveryAddressId?: number;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  deliveryCountry?: number;
  deliveryTown?: string;
  deliveryPostCode?: string;
  deliveryPhoneNumber?: string;
  deliveryEMail?: string;
}

export interface UiVenueContact {
  id?: number;
  venueId?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role?: string;
  roleIndex?: string;
  venueRoleId?: number;
  roleName?: string;
}

export interface UiBarredVenue {
  id?: number;
  barredVenueId: number;
}

type UiVenueAddress = PrimaryAddress | DeliveryAddress;

export interface VenueData {
  AddressLoadingW3W: string;
  AddressStageDoorW3W: string;
  AddressEntranceW3W: string;
  BarringClause: number;
  BarringMiles: number;
  BarringWeeksPost: number;
  BarringWeeksPre: number;
  Code: string;
  CulturallyExempt: boolean;
  ExcludeFromChecks: boolean;
  FamilyId: number;
  GridHeight: number;
  Id: number;
  IsDeleted: boolean;
  LXDesk: string;
  LXNotes: string;
  Name: string;
  Seats: number;
  SoundDesk: string;
  SoundNotes: string;
  StageSize: string;
  StatusCode: string;
  TechSpecsURL: string;
  TownPopulation: number;
  VATIndicator: boolean;
  VenueAccountId: number;
  VenueAddress?: VenueAddress[];
  VenueContact?: VenueContact[];
  VenueFlags: number;
  VenueNotes: number;
  VenueWarningNotes: number;
  Website: string;
}
export interface UiVenue {
  id?: number;
  venueCode: string;
  venueName: string;
  venueStatus: string;
  vatIndicator: boolean;
  culturallyExempt?: boolean;
  venueFamily: number;
  venueCapacity: number;
  townPopulation: number;
  venueWebsite: string;
  notes: string;
  barringMiles: number;
  postShow: number;
  preShow: number;
  barringClause: string;
  confidentialNotes: string;
  soundDesk: string;
  soundNotes: string;
  techLXDesk: string;
  techLXNotes: string;
  stageSize: string;
  gridHeight: string;
  techSpecsUrl: string;
  flags: string;
  excludeFromChecks: boolean;
  what3WordsStage?: string;
  what3WordsLoading?: string;
  what3WordsEntrance: string;
  barredVenues?: UiBarredVenue[];
  files?: fileInterface[];
}

export const transformVenueContacts = (contacts?: VenueContact & { VenueRole: VenueRole }): UiVenueContact => {
  const { Id: id, VenueId, FirstName, LastName, Phone, Email, Role, RoleIndex, VenueRoleId, VenueRole } = contacts;

  return {
    id,
    venueId: VenueId,
    firstName: FirstName,
    lastName: LastName,
    phone: Phone,
    email: Email,
    role: Role,
    roleIndex: RoleIndex,
    venueRoleId: isUndefined(VenueRoleId) ? VenueRole.Id : VenueRoleId,
    roleName: VenueRole.Name,
  };
};

export const trasformVenueAddress = (address?: VenueAddress): UiVenueAddress => {
  const { Id: id, Line1, Line2, Line3, TypeName, Town, Postcode, CountryId, Phone, Email } = address || {};
  if (TypeName === 'Main') {
    return {
      primaryAddressId: id,
      primaryAddress1: Line1,
      primaryAddress2: Line2,
      primaryAddress3: Line3,
      primaryCountry: CountryId,
      primaryTown: Town,
      primaryPostCode: Postcode,
      primaryPhoneNumber: Phone,
      primaryEMail: Email,
    };
  }
  return {
    deliveryAddressId: id,
    deliveryAddress1: Line1,
    deliveryAddress2: Line2,
    deliveryAddress3: Line3,
    deliveryCountry: CountryId,
    deliveryTown: Town,
    deliveryPostCode: Postcode,
    deliveryPhoneNumber: Phone,
    deliveryEMail: Email,
  };
};

export type UiTransformedVenue = UiVenue & PrimaryAddress & DeliveryAddress;

export const transformVenues = (
  Venues: (Venue & {
    VenueAddress: VenueAddress[];
    VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: VenueBarredVenue[];
    VenueContact: (VenueContact & { VenueRole: VenueRole })[];
    Files: fileInterface[];
  })[],
): UiTransformedVenue[] => {
  return Venues.map(
    ({
      Id: id,
      Name,
      Code,
      StatusCode,
      Website,
      VATIndicator,
      TechSpecsURL,
      Seats,
      BarringClause,
      TownPopulation,
      VenueAddress,
      LXDesk,
      LXNotes,
      SoundDesk,
      SoundNotes,
      StageSize,
      GridHeight,
      VenueFlags,
      BarringWeeksPre,
      BarringWeeksPost,
      BarringMiles,
      CulturallyExempt,
      FamilyId,
      VenueNotes,
      VenueWarningNotes,
      ExcludeFromChecks,
      AddressStageDoorW3W,
      AddressLoadingW3W,
      AddressEntranceW3W,
      VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: BarredVenues,
      VenueContact,
      Files,
    }) => {
      const address1 = trasformVenueAddress(VenueAddress?.[0]) || {};
      const address2 = trasformVenueAddress(VenueAddress?.[1]) || {};
      const barredVenues: UiBarredVenue[] = BarredVenues?.map(({ Id: id, BarredVenueId: barredVenueId }) => ({
        id,
        barredVenueId,
      }));
      const venueContacts = VenueContact?.map((contact) => transformVenueContacts(contact));
      return {
        id,
        venueCode: Code,
        venueName: Name,
        venueStatus: StatusCode,
        vatIndicator: VATIndicator,
        culturallyExempt: CulturallyExempt,
        venueFamily: FamilyId,
        venueCapacity: Seats,
        townPopulation: TownPopulation,
        venueWebsite: Website,
        notes: VenueNotes,
        barringMiles: BarringMiles,
        postShow: BarringWeeksPost,
        preShow: BarringWeeksPre,
        barringClause: BarringClause,
        confidentialNotes: VenueWarningNotes,
        soundDesk: SoundDesk,
        soundNotes: SoundNotes,
        techLXDesk: LXDesk,
        techLXNotes: LXNotes,
        stageSize: StageSize,
        gridHeight: GridHeight,
        techSpecsUrl: TechSpecsURL,
        flags: VenueFlags,
        excludeFromChecks: ExcludeFromChecks,
        what3WordsStage: AddressStageDoorW3W,
        what3WordsLoading: AddressLoadingW3W,
        what3WordsEntrance: AddressEntranceW3W,
        barredVenues,
        ...address1,
        ...address2,
        venueContacts,
        files: Files,
      };
    },
  );
};

export const mapVenueContactToPrisma = ({
  id: Id,
  firstName: FirstName,
  lastName: LastName,
  phone: Phone,
  email: Email,
  venueRoleId: VenueRoleId,
  roleName: RoleName,
}: UiVenueContact): Partial<VenueContact & { RoleName?: string }> => {
  return {
    Id,
    FirstName,
    LastName,
    Phone,
    Email,
    VenueRoleId,
    RoleName,
  };
};

export const filterEmptyVenueContacts = (
  venueContacts: UiVenueContact[],
  standardRoles: SelectOption[],
): UiVenueContact[] => {
  return venueContacts.filter(({ firstName, lastName, email, phone, roleName }) => {
    const isStandardRole = standardRoles.some((rolesOption) => rolesOption.text === roleName);
    const hasNonEmptyContactInfo = firstName || lastName || email || phone;

    return (isStandardRole && hasNonEmptyContactInfo) || !isStandardRole;
  });
};
