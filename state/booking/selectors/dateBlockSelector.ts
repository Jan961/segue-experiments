import { selector } from 'recoil';
import { productionJumpState } from '../productionJumpState';
import { dateBlockState } from '../dateBlockState';
import BookingHelper, { getArchivedProductionIds } from 'utils/booking';

export const dateBlockSelector = selector({
  key: 'dateBlockSelector',
  get: ({ get }) => {
    const { productions, includeArchived } = get(productionJumpState);
    const dateBlocks = get(dateBlockState);
    const archivedProductionIds = getArchivedProductionIds(productions);
    const scheduleDateBlocks = dateBlocks.filter(db=> !archivedProductionIds.includes(db.ProductionId))
    const helper = new BookingHelper({});
    const { start:scheduleStart, end:scheduleEnd } = helper.getRangeFromDateBlocks(includeArchived?dateBlocks:scheduleDateBlocks);
    return { scheduleDateBlocks:includeArchived?dateBlocks:scheduleDateBlocks, scheduleStart, scheduleEnd}
  },
});