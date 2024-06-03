import { VenueMinimalDTO } from 'interfaces';
import { selectorFamily } from 'recoil';
import { venueState } from 'state/booking/venueState';
import { currentProductionSelector } from './currentProductionSelector';

export const venueOptionsSelector = selectorFamily({
  key: 'venueOptionsSelector',
  get:
    (excludedVenueIds: number[] = []) =>
    ({ get }) => {
      const currentProduction = get(currentProductionSelector);
      const venueDict: Record<number, VenueMinimalDTO> = get(venueState);
      const options = [];
      for (const venue of Object.values(venueDict)) {
        // Pushes options without regions
        if (excludedVenueIds.includes(venue.Id) || venue.RegionId !== currentProduction.ShowRegionId) continue;

        if (venue.RegionId === -1 || venue.RegionId === currentProduction.ShowRegionId) {
          options.push({
            text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,

            value: venue?.Id,
          });
        }
      }

      return options.sort((a, b) => a.text.localeCompare(b.text));
    },
});
