import { ProductionDTO } from 'interfaces';
import ProductionListItem from './ProductionListItem';

type Props = {
  items: ProductionDTO[];
  editable?: boolean;
  showDateBlock?: boolean;
};

const ProductionList = ({ items, editable, showDateBlock = true }: Props) => (
  <ul role="list">
    {items.map((item) => (
      <ProductionListItem production={item} key={item.Id} editable={editable} showDateBlock={showDateBlock} />
    ))}
  </ul>
);

export default ProductionList;
