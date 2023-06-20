import { addDays } from 'date-fns'

const getKey = (date: string) => (date.split('T')[0])

export const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = []

  for (let dt = new Date(start); dt <= new Date(end); dt = addDays(dt, 1)) {
    arr.push(new Date(dt).toISOString())
  }
  return arr.map(getKey)
}
