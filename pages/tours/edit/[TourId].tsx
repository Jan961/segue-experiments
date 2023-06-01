import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { getTourById } from 'services/TourService'
import { tourEditorMapper } from 'lib/mappers'
import { TourDTO } from 'interfaces'
import { TourEditor } from 'components/tours/TourEditor'

type EditProps = {
    tour: TourDTO
}

const Edit = ({ tour }: EditProps) => {
  return (
    <Layout title="Edit Tour | Segue">
      <TourEditor tour={tour} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const tourId = ctx.params.TourId as string
  const tour = await getTourById(parseInt(tourId))

  return { props: { tour: tourEditorMapper(tour) } }
}

export default Edit
