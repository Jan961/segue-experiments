import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { TourEditor } from 'components/tours/TourEditor'
import { TourDTO } from 'interfaces'

type CreateProps = {
  tour: TourDTO
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

const Create = ({ tour }: CreateProps) => {
  /*
  const dateError = (inputs: any) => {
    const tStart = new Date(inputs.TourStartDate)
    const tEnd = new Date(inputs.TourEndDate)
    const rStart = new Date(inputs.RehearsalStartDate)
    const rEnd = new Date(inputs.RehearsalEndDate)

    if (!inputs.TourStartDate || !inputs.TourEndDate) return 'Tour dates must be selected'
    else {
      if (isAfter(tStart, tEnd)) return 'Tour End date must be after start date'
      if (Math.abs(differenceInDays(tEnd, tStart)) > 365 * 2) return 'Tours cannot be longer than 2 years'
    }

    if (inputs.RehearsalStartDate || inputs.RehearsalEndDate) {
      if (!inputs.RehearsalStartDate || !inputs.RehearsalEndDate) return 'If you select a rehearsal date it must be valid'
      if (isAfter(rStart, rEnd)) return 'Rehearsal End date must be after start date'
      if (Math.abs(differenceInDays(rEnd, rStart)) > 365) return 'Tours cannot be longer than 2 year'
    }
    return null
  }

  const error = dateError(inputs)
  */

  return (
    <Layout title="Add Tour | Segue">
      <TourEditor tour={tour} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowId } = ctx.params

  const tour = { ...DEFAULT_TOUR, ShowId: parseInt(ShowId as string) }
  return { props: { tour } }
}

export default Create
