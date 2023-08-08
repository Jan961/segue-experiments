import { selector } from 'recoil'
import { objectify } from 'radash'
import { scheduleSelector } from './scheduleSelector'

export const scheduleDictSelector = selector({
  key: 'scheduleDictSelector',
  get: ({ get }) => {
    const source = get(scheduleSelector)
    const dates = source.Sections.map(sec => sec.Dates).flat()
    return objectify(dates, d => d.Date)
  }
})
