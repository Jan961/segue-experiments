import { GetServerSideProps } from 'next';
import { Productions } from 'components/shows/Productions';
import { getProductionPageProps } from 'services/ProductionService';

const ProductionSelection = (props: any) => <Productions {...props} />;

export default ProductionSelection;

export const getServerSideProps: GetServerSideProps = async (ctx) => getProductionPageProps(ctx);
