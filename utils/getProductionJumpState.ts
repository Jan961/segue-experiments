import { dateBlockMapper } from 'lib/mappers';
import { ParsedUrlQuery } from 'querystring';
import { getAllProductions, getAllProductionRegions } from 'services/productionService';
import { ProductionJump } from 'state/booking/productionJumpState';

interface Params extends ParsedUrlQuery {
  ShowCode: string;
  ProductionCode: string;
}

export const getProductionJumpState = async (ctx, path: string, AccountId: number): Promise<ProductionJump> => {
  const { ProductionCode, ShowCode } = (ctx.params || {}) as Params;
  const productionsRaw = await getAllProductions(AccountId);
  const allProductionRegions : any = await getAllProductionRegions();
  console.log(allProductionRegions);
  const selectedProduction = productionsRaw.find(
    (production: any) => production.Code === ProductionCode && production.Show.Code === ShowCode,
  );
  return {
    productions: productionsRaw
      .map((t: any) => {
        let db = t.DateBlock.find((block) => block.IsPrimary);
        if (db) {
          db = dateBlockMapper(db);
        }
        return {
          Id: t.Id,
          Code: t.Code,
          IsArchived: t.IsArchived,
          ShowCode: t.Show.Code,
          ShowName: t.Show.Name,
          StartDate: db?.StartDate || null,
          EndDate: db?.EndDate || null,
          ShowRegionId: allProductionRegions ? allProductionRegions.find((pair :any ) => pair.PRProductionId == t.Id).PRRegionId : null

        };
      })
      .sort((a, b) => {
        if (a.IsArchived !== b.IsArchived) {
          return a.IsArchived ? 1 : -1;
        }
        return new Date(a.StartDate).valueOf() > new Date(b.StartDate).valueOf();
      }),
    selected: selectedProduction?.Id || null,
    includeArchived: selectedProduction?.IsArchived || false,
    path,
  };
};
