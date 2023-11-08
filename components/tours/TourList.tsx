import { TourDTO } from 'interfaces';
import TourListItem from './TourListItem';

type Props = {
  items: TourDTO[];
  editable?: boolean;
};

const TourList = ({ items, editable }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <TourListItem tour={item} key={item.Id} editable={editable} />
    ))}
  </ul>
);

export default TourList;
