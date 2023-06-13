
type Sortable = {
  Date: string
  Id: number
}

export const getNextId = (sorted: Sortable[], current: number) => {
  let found = false

  for (const b of sorted) {
    if (found) return b.Id
    if (current === b.Id) found = true
  }
  return undefined
}
