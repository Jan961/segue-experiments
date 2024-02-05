import { ParsedUrlQuery } from 'querystring';
import { getAllProductions } from 'services/productionService';
import { ProductionJump } from 'state/booking/productionJumpState';

interface Params extends ParsedUrlQuery {
  ShowCode: string;
  ProductionCode: string;
}

export const getProductionJumpState = async (ctx, path: string, AccountId: number): Promise<ProductionJump> => {
  const { ProductionCode, ShowCode, resolvedUrl } = (ctx.params || {}) as Params;
  const productionsRaw = await getAllProductions(AccountId);
  console.log('==resolvedUrl==', resolvedUrl);
  const selectedProduction = productionsRaw.find(
    (production: any) => production.Code === ProductionCode && production.Show.Code === ShowCode,
  )?.Id;
  return {
    productions: productionsRaw.map((t: any) => ({
      Id: t.Id,
      Code: t.Code,
      IsArchived: t.IsArchived,
      ShowCode: t.Show.Code,
      ShowName: t.Show.Name,
    })),
    selected: selectedProduction || null,
    path,
  };
};
