import { NextApiRequest } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  getAllProductionRegions,
  getUserAccessibleProductions,
  transformProductions,
} from 'services/productionService';
import { getOrganisationIdFromReq } from 'services/userService';
import { ProductionJump } from 'state/booking/productionJumpState';

interface Params extends ParsedUrlQuery {
  ShowCode: string;
  ProductionCode: string;
}

export const getProductionJumpState = async (ctx, path: string): Promise<ProductionJump> => {
  const { ProductionCode, ShowCode } = (ctx.params || {}) as Params;
  let organisationId = ctx.req.headers['x-organisation-id'] as string;
  if (!organisationId) {
    organisationId = await getOrganisationIdFromReq(ctx.req as NextApiRequest);
  }
  const productionsRaw = await getUserAccessibleProductions(ctx.req as NextApiRequest, organisationId);
  const allProductionRegions: any = await getAllProductionRegions(ctx.req as NextApiRequest);
  const selectedProduction = productionsRaw.find(
    (production: any) => production.Code === ProductionCode && production.Show.Code === ShowCode,
  );
  const productions = transformProductions(productionsRaw, allProductionRegions);
  return {
    productions,
    selected: selectedProduction?.Id || null,
    includeArchived: selectedProduction?.IsArchived || false,
    path,
  };
};
