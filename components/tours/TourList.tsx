import TourListItem from './TourListItem'
import { Tour } from 'interfaces'

type Props = {
    items: Tour[]
}

const TourList = ({ items }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <TourListItem data={item} key={item.TourId}/>
    ))}
  </ul>
)

export default TourList
