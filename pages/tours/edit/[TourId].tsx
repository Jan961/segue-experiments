import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { getTourById } from 'services/TourService'
import { tourEditorMapper } from 'lib/mappers'
import { TourDTO } from 'interfaces'
import { TourEditor } from 'components/tours/TourEditor'
import { getEmailFromReq, checkAccess } from 'services/userService'

type EditProps = {
    tour: TourDTO
    showCode: string
}

const Edit = ({ tour, showCode }: EditProps) => {
  return (
    <Layout title="Edit Tour | Segue">
      <TourEditor tour={tour} showCode={showCode} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const TourId = parseInt(ctx.params.TourId as string)
  const email = await getEmailFromReq(ctx.req)

  const access = await checkAccess(email, { TourId })
  if (!access) return { notFound: true }

  const tour = await getTourById(TourId)

  return { props: { tour: tourEditorMapper(tour), showCode: tour.Show.Code } }
}

export default Edit
