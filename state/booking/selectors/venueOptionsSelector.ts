import { VenueMinimalDTO } from 'interfaces';
import { selectorFamily, useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import { currentProductionSelector } from './currentProductionSelector';

export const venueOptionsSelector = selectorFamily({
  key: 'venueOptionsSelector',
  get:
    (excludedVenueIds: number[] = []) =>
    ({ get }) => {
      const currentProduction = useRecoilValue(currentProductionSelector);
      const venueDict: Record<number, VenueMinimalDTO> = get(venueState);
      const options = [];
      console.log('Current Production ', currentProduction);
      for (const venue of Object.values(venueDict)) {
        console.log('Venue Region ID', venue.RegionId);
        console.log(venue);
        //  Pushes options without regions
        if (venue.RegionId === -1) {
          options.push({
            text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
            value: venue?.Id,
          });
          continue;
        }
        console.log('Show Region ID', currentProduction.ShowRegionId);
        console.log(excludedVenueIds.includes(venue.Id));
        if (excludedVenueIds.includes(venue.Id) || venue.RegionId !== currentProduction.ShowRegionId) continue;
        options.push({
          text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
          value: venue?.Id,
        });
      }
      console.log('returning');
      console.log(options.sort((a, b) => a.text.localeCompare(b.text)));
      return options.sort((a, b) => a.text.localeCompare(b.text));
    },
});
