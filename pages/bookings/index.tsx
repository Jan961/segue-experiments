import { GetServerSideProps } from 'next';
import { AllTourPageProps, getAllTourPageProps } from 'services/TourService';
import { TourSelector } from 'components/TourSelector';

const ShowSelection = ({ tours }: AllTourPageProps) => <TourSelector tours={tours} />;

export const getServerSideProps: GetServerSideProps = (ctx) => getAllTourPageProps(ctx);

export default ShowSelection;
