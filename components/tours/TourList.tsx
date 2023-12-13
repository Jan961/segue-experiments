import { TourDTO } from 'interfaces';
import TourListItem from './TourListItem';

type Props = {
  items: TourDTO[];
  editable?: boolean;
  showDateBlock?: boolean;
};

const TourList = ({ items, editable, showDateBlock = true }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <TourListItem tour={item} key={item.Id} editable={editable} showDateBlock={showDateBlock} />
    ))}
  </ul>
);

export default TourList;
