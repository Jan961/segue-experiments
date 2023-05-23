import TourListItem from './TourListItem'

type Props = {
    items: any[]
}

const TourList = ({ items }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <TourListItem tour={item} key={item.TourId}/>
    ))}
  </ul>
)

export default TourList
