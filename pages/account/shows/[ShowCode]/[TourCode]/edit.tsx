import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { getTourById, lookupTourId } from 'services/TourService'
import { tourEditorMapper } from 'lib/mappers'
import { TourDTO } from 'interfaces'
import { TourEditor } from 'components/tours/TourEditor'
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService'

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
  const { TourCode, ShowCode } = ctx.params

  const AccountId = await getAccountIdFromReq(ctx.req)
  const email = await getEmailFromReq(ctx.req)
  const { Id } = await lookupTourId(ShowCode as string, TourCode as string, AccountId)

  const access = await checkAccess(email, { TourId: Id })
  if (!access) return { notFound: true }

  const tour = await getTourById(Id)

  return { props: { tour: tourEditorMapper(tour), showCode: tour.Show.Code } }
}

export default Edit
