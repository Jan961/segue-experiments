import { useState } from 'react'
import axios from 'axios'
import { Tour } from 'interfaces'
import { userService } from 'services/user.service'
import { loggingService } from 'services/loggingService'
import { FormContainer } from 'components/global/forms/FormContainer'
import Layout from 'components/Layout'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputUpload } from 'components/global/forms/FormInputUpload'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { GetServerSideProps } from 'next'
import { getTourById } from 'services/TourService'
import { useRouter } from 'next/router'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

type EditProps = {
    tour: Tour
}

const Edit = ({ tour }: EditProps) => {
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const owner = userService.userValue.accountId
  const back = `/tours/${tour.ShowId}`


  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    Code: tour.Code,
    ShowId: tour.ShowId,
    TourStartDate: tour.TourStartDate,
    TourEndDate: tour.TourStartDate,

    RehearsalStartDate: tour.RehearsalStartDate,
    RehearsalEndDate: tour.RehearsalEndDate,
    logo: tour.logo,
    AccountId: owner

  })

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg }
      })
      setInputs({
        Code: inputs.Code,
        ShowId: inputs.ShowId,
        TourStartDate: inputs.TourStartDate,
        TourEndDate: inputs.TourStartDate,
        RehearsalStartDate: inputs.RehearsalStartDate,
        RehearsalEndDate: inputs.RehearsalEndDate,
        logo: inputs.logo,
        AccountId: owner
      })
    } else {
      // @ts-ignore
      setStatus(false)
    }
  }
  const handleOnChange = (e) => {
    // e.persist();
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0]
      setImage(i)
      setCreateObjectURL(URL.createObjectURL(i))
    }
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
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))

    if (image) {
      const fd = new FormData()
      fd.append('file', image)
      const res = await fetch('/api/fileUpload/upload', {
        method: 'POST',
        headers: {},
        body: fd
      })
      const response = await res.json()
      inputs.logo = response.data
    }

    axios({
      method: 'POST',
      url: '/api/tours/update/' + tour.TourId,
      data: inputs
    })
      .then((response) => {
        // @ts-ignore
        loggingService.logAction('Tour', 'Update')
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )
        router.push(back)
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        loggingService.logError(error)
        handleServerResponse(false, error.response.data.error)
      })
  }

  return (
    <Layout title="Edit Tour | Segue">
      <FormContainer>
        <div className="mb-4">
          <Link href={back}><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Edit: {tour.Show.Name} {tour.TourId}
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInputText label="Code" value={inputs.Code} name="Code" placeholder="XYZABC" onChange={handleOnChange} required />
          <FormInputDate label="Tour Start Date" value={convertDate(inputs.TourStartDate)} name="TourStartDate" onChange={handleOnChange} required />
          <FormInputDate label="Tour End Date" value={convertDate(inputs.TourEndDate)} name="TourEndDate" onChange={handleOnChange} required />
          <FormInputDate label="Rehearsal Start Date" value={convertDate(inputs.RehearsalStartDate)} name="RehearsalStartDate" onChange={handleOnChange} required />
          <FormInputDate label="Rehearsal End Date" value={convertDate(inputs.RehearsalEndDate)} name="RehearsalEndDate" onChange={handleOnChange} required />
          <FormInputUpload label="Tour Logo" value={inputs.logo} name="Logo" onChange={handleOnChange}>
            <img src={createObjectURL} height="200px" width="200px"/>
          </FormInputUpload>
          <FormButtonSubmit text="Save Tour" disabled={status.submitted} loading={status.submitting} />
        </form>
      </FormContainer>
    </Layout>
  )

  function convertDate (date: Date) {
    const dateObject = new Date(date)
    if (dateObject.getTime() <= 0) return 'N/A'
    return dateObject.toISOString().slice(0, 10).toString()
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const tourId = ctx.params.TourId as string
  const tour = await getTourById(parseInt(tourId))

  return { props: { tour } }
}

export default Edit
