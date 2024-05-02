import { selector } from 'recoil';
import { productionJumpState } from '../../booking/productionJumpState';
import { contractsDateBlockState } from '../contractsDateBlockState';
import { getArchivedProductionIds } from 'utils/booking';
import ContractsHelper from 'utils/contracts';

export const contractsDateBlockSelector = selector({
  key: 'dateBlockSelector',
  get: ({ get }) => {
    const { productions, includeArchived } = get(productionJumpState);
    const dateBlocks = get(contractsDateBlockState);
    const archivedProductionIds = getArchivedProductionIds(productions);
    const scheduleDateBlocks = dateBlocks.filter((db) => !archivedProductionIds.includes(db.ProductionId));
    const helper = new ContractsHelper({});
    const { start: scheduleStart, end: scheduleEnd } = helper.getRangeFromDateBlocks(
      includeArchived ? dateBlocks : scheduleDateBlocks,
    );
    return { scheduleDateBlocks: includeArchived ? dateBlocks : scheduleDateBlocks, scheduleStart, scheduleEnd };
  },
});
