import { GetServerSideProps } from 'next'
import { ShowPageProps, getShowPageProps } from 'services/ShowService'
import { Shows } from 'components/shows/Shows'

const ShowSelection = ({ shows }: ShowPageProps) => (<Shows shows={shows}/>)

export const getServerSideProps: GetServerSideProps = () => getShowPageProps()

export default ShowSelection
