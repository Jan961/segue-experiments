import { GetServerSideProps } from 'next';
import { AllProductionPageProps, getAllProductionPageProps } from 'services/ProductionService';
import { ProductionSelector } from 'components/ProductionSelector';

const ShowSelection = ({ productions }: AllProductionPageProps) => <ProductionSelector productions={productions} />;

export const getServerSideProps: GetServerSideProps = (ctx) => getAllProductionPageProps(ctx);

export default ShowSelection;
