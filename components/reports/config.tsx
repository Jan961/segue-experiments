
type SelectOption = {
    id:number,
    value:string|number,
    label:string,
}

export const numberOfWeeks:SelectOption[] = [
  {
    id: 1,
    label: '1',
    value: 1
  },
  {
    id: 2,
    label: '2',
    value: 2
  },
  {
    id: 3,
    label: '3',
    value: 3
  },
  {
    id: 4,
    label: '4',
    value: 4
  },
  {
    id: 5,
    label: '5',
    value: 5
  }
]

export const orderByOptions = [
  {
    id: 1,
    label: 'Show Sales (Low to Highest)',
    value: 'sales'
  },
  {
    id: 2,
    label: 'Change (Lowest to highest)',
    value: 'change'
  },
  {
    id: 3,
    label: '3',
    value: 3
  }

]
