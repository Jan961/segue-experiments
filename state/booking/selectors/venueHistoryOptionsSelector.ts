import { VenueMinimalDTO } from 'interfaces';
import { selectorFamily } from 'recoil';
import { venueState } from 'state/booking/venueState';

export const venueHistoryOptionsSelector = selectorFamily({
  key: 'venueHistoryOptionsSelector',
  get:
    () =>
    ({ get }) => {
      const venueDict: Record<number, VenueMinimalDTO> = get(venueState);
      const options = [];
      for (const venue of Object.values(venueDict)) {
        options.push({
          text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
          value: venue?.Id,
        });
      }
      return options.sort((a, b) => a.text.localeCompare(b.text));
    },
});
