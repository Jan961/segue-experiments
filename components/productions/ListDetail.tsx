import { Show, Production } from '../../interfaces';

type ListDetailProps = {
  item: Production;
  show: Show;
};

const ListDetail = ({ item: production }: ListDetailProps) => (
  <div>
    <h1>Detail for {production.ProductionId}</h1>
    <p>ID: {production.ProductionId}</p>
  </div>
);

export default ListDetail;
