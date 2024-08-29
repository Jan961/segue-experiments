import { GetServerSideProps } from 'next';
import { ProductionSelector } from 'components/ProductionSelector';
import { AllProductionPageProps, getAllProductionPageProps } from 'services/productionService';

const ShowSelection = ({ productions }: AllProductionPageProps) => <ProductionSelector productions={productions} />;

export const getServerSideProps: GetServerSideProps = () => getAllProductionPageProps();

export default ShowSelection;
