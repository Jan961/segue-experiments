import ShowListItem from './ShowListItem'
import { Show } from '../../interfaces'

type ShowListProps = {
    items: Show[]
}

const ShowList = ({ items }: ShowListProps) => (
  <ul role="list" className="divide-y divide-gray-200">
    {items?.map((item) => (
      <ShowListItem data={item} key={item.ShowId} />
    ))}
  </ul>
)

export default ShowList
