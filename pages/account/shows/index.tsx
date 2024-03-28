import { GetServerSideProps } from 'next';
import { getShowPageProps } from 'services/ShowService';

const ShowSelection = () => null;

export const getServerSideProps: GetServerSideProps = (ctx) => getShowPageProps(ctx);

export default ShowSelection;
