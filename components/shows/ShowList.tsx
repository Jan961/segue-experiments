import { ShowDTO } from 'interfaces';
import { ShowListItem } from './ShowListItem';

type ShowListProps = {
  items: ShowDTO[];
};

export const ShowList = ({ items }: ShowListProps) => (
  <ul role="list">{items?.map((item) => <ShowListItem show={item} key={item.Id} />)}</ul>
);
