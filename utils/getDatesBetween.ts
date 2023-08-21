import { addDays } from 'date-fns'
import { getKey } from 'services/dateService'

export const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = []

  for (let dt = new Date(start); dt <= new Date(end); dt = addDays(dt, 1)) {
    arr.push(new Date(dt).toISOString())
  }
  return arr.map(getKey)
}
