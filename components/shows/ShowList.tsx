import { ShowListItem } from './ShowListItem'

type ShowListProps = {
  items: any[]
}

export const ShowList = ({ items }: ShowListProps) => (
  <ul role="list">
    {items?.map((item) => (
      <ShowListItem show={item} key={item.ShowId} />
    ))}
  </ul>
)
