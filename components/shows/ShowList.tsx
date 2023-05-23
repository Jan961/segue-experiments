import { ShowListItem } from './ShowListItem'
import { Show } from 'interfaces'

type ShowListProps = {
    items: Show[]
}

export const ShowList = ({ items }: ShowListProps) => (
  <ul role="list">
    {items?.map((item) => (
      <ShowListItem data={item} key={item.ShowId} />
    ))}
  </ul>
)
