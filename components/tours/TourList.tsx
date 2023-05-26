import { TourDTO } from 'interfaces'
import TourListItem from './TourListItem'

type Props = {
    items: TourDTO[]
}

const TourList = ({ items }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <TourListItem tour={item} key={item.Id}/>
    ))}
  </ul>
)

export default TourList
