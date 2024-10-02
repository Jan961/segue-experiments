import { VenueRoleDTO } from 'interfaces';
import { VenueRole } from 'prisma/generated/prisma-client';

export const mapVenueRoleToPrisma = (vr: VenueRoleDTO): VenueRole => ({
  Id: vr.Id,
  Name: vr.Name,
  IsStandard: vr.Standard,
});
