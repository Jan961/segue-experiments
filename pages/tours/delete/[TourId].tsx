import { useState } from 'react'
import axios from 'axios'
import { loggingService } from 'services/loggingService'
import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FormContainer } from 'components/global/forms/FormContainer'
import { useRouter } from 'next/router'
import { tourEditorMapper } from 'interfaces/mappers'
import { TourDTO } from 'interfaces'
import { FormInfo } from 'components/global/forms/FormInfo'
import { getTourById } from 'services/TourService'

type Props = {
  tour: TourDTO
}

const Deletetour = ({ tour }: Props) => {
  const router = useRouter()
  const back = `/tours/${tour.ShowId}`

  const [status, setStatus] = useState({
    submitted: true,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({ Confirmation: '' })

  const handleOnChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true, submitted: false }))
    axios({
      method: 'POST',
      url: '/api/tours/delete/' + tour.Id,
      data: inputs
    }).then((response) => {
      loggingService.logAction('Show', 'Show Updated')
      setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: true }))
      router.push(back)
    }).catch((error) => {
      loggingService.logError(error)
      setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: false }))
    })
  }

  const matching = inputs.Confirmation.toLowerCase() === tour.Code.toLowerCase()

  return (
    <Layout title="Delete Show | Segue">
      <FormContainer>
        <div className="mb-4">
          <Link href={back}><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Delete: {tour.ShowName} - {tour.Code}
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER'>
            Warning. This will delete the tour, and any documents or information associated with it.
          </FormInfo>
          <p className="mb-2">Type <b>{tour.Code}</b> in the text field to confirm deletion</p>
          <FormInputText name="Confirmation" value={inputs.Confirmation} onChange={handleOnChange} required />
          <FormButtonSubmit disabled={!matching} intent="DANGER" loading={status.submitting} text="Delete Tour" />
        </form>
      </FormContainer>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const tourId = ctx.params.TourId as string
  const tour = await getTourById(parseInt(tourId))

  return { props: { tour: tourEditorMapper(tour) } }
}

export default Deletetour
