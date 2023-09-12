import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { TourEditor } from 'components/tours/TourEditor'
import { TourDTO } from 'interfaces'
import { getShowById, lookupShowCode } from 'services/ShowService'
import { getEmailFromReq, getAccountId } from 'services/userService'

type CreateProps = {
  tour: TourDTO
  showCode: string
}

const DEFAULT_TOUR: Pick<TourDTO, 'DateBlock' | 'IsArchived' | 'Code'> = {
  Code: '',
  IsArchived: false,
  DateBlock: [{
    Name: 'Tour',
    StartDate: '',
    EndDate: ''
  },
  {
    Name: 'Rehearsal',
    StartDate: '',
    EndDate: ''
  }]
}

const Create = ({ tour, showCode }: CreateProps) => {
  return (
    <Layout title="Add Tour | Segue">
      <TourEditor showCode={showCode} tour={tour} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode } = ctx.params

  const email = await getEmailFromReq(ctx.req)
  const accountId = await getAccountId(email)

  const ShowId = await lookupShowCode(ShowCode as string, accountId)

  if (!ShowId) return { notFound: true }

  // No need to check access, we are looking up based on AccountId

  const show = await getShowById(ShowId)

  const tour = { ...DEFAULT_TOUR, ShowId, ShowName: show.Name }
  return { props: { tour, showCode: ShowCode } }
}

export default Create
