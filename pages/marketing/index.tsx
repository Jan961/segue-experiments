import { GetServerSideProps } from 'next';
import { TourSelector } from 'components/TourSelector';
import { AllTourPageProps, getAllTourPageProps } from 'services/TourService';

const ShowSelection = ({ tours }: AllTourPageProps) => <TourSelector tours={tours} />;

export const getServerSideProps: GetServerSideProps = (ctx) => getAllTourPageProps(ctx);

export default ShowSelection;
