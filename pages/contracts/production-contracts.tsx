import { GetServerSideProps } from 'next';
import { ProductionSelector } from 'components/ProductionSelector';
import { AllProductionPageProps, getAllProductionPageProps } from 'services/productionService';

const ShowSelection = ({ productions }: AllProductionPageProps) => <ProductionSelector productions={productions} />;

export const getServerSideProps: GetServerSideProps = (ctx) => getAllProductionPageProps(ctx);

export default ShowSelection;