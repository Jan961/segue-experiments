import { GetServerSideProps } from 'next';
import { Tours } from 'components/shows/Tours';
import { getTourPageProps } from 'services/TourService';

const TourSelection = (props: any) => <Tours {...props} />;

export default TourSelection;

export const getServerSideProps: GetServerSideProps = async (ctx) => getTourPageProps(ctx);
