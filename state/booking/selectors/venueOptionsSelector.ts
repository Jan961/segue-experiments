import { VenueMinimalDTO } from 'interfaces';
import { selectorFamily } from 'recoil';
import { venueState } from 'state/booking/venueState';

export const venueOptionsSelector = selectorFamily({
  key: 'venueOptionsSelector',
  get:
    (excludedVenueIds: number[] = []) =>
    ({ get }) => {
      const venueDict: Record<number, VenueMinimalDTO> = get(venueState);
      const options = [];
      for (const venue of Object.values(venueDict)) {
        if (excludedVenueIds.includes(venue.Id)) continue;
        options.push({
          text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
          value: venue?.Id,
        });
      }
      return options.sort((a, b) => a.text.localeCompare(b.text));
    },
});
