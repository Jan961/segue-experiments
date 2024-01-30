import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Productions } from 'components/shows/Production';
import { getProductionPageProps } from 'services/ProductionService';

const ProductionSelection = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => <Productions {...props} />;

export default ProductionSelection;

export const getServerSideProps: GetServerSideProps = async (ctx) => getProductionPageProps(ctx);
