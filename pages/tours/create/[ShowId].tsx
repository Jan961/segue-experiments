import { useState } from 'react'
import axios from 'axios'
import { userService } from 'services/user.service'
import { loggingService } from 'services/loggingService'
import { FormContainer } from 'components/global/forms/FormContainer'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ThumbnailUpload } from 'components/files/ThumbnailUpload'

type CreateProps = {
    show: number
}

const Create = ({ show }: CreateProps) => {
  const router = useRouter()
  const owner = userService.userValue.accountId
  const back = `/tours/${show}`

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    Code: '',
    ShowId: parseInt(String(show)),
    TourStartDate: '',
    TourEndDate: '',
    Logo: '',
    RehearsalStartDate: '',
    RehearsalEndDate: '',
    AccountId: owner
  })

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg }
      })
    } else {
      // @ts-ignore
      setStatus(false)
    }
  }

  const handleOnChange = async (e: any) => {
    e.persist()

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))

    console.log(e.target.id)

    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })
  }

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))
    axios({
      method: 'POST',
      url: '/api/tours/create/',
      data: inputs
    }).then((response) => {
      loggingService.logAction('Tour', 'Add  Tour')
      handleServerResponse(
        true,
        'Thank you, your message has been submitted.'
        // Todo: router setlocation to the new venue to allow user to add the rest fo the detils

      )
      router.push(back)
    }).catch((error) => {
      loggingService.logError(error)
      handleServerResponse(false, error.response.data.error)
    })
  }

  return (
    <Layout title="Add Tour | Segue">
      <FormContainer>
        <div className="mb-4">
          <Link href={back}><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Add Tour
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInputText label="Code" value={inputs.Code} name="Code" placeholder="XYZABC" onChange={handleOnChange} required />
          <FormInputDate label="Tour Start Date" value={inputs.TourStartDate} name="TourStartDate" onChange={handleOnChange} required />
          <FormInputDate label="Tour End Date" value={inputs.TourEndDate} name="TourEndDate" onChange={handleOnChange} required />
          <FormInputDate label="Rehearsal Start Date" value={inputs.RehearsalStartDate} name="RehearsalStartDate" onChange={handleOnChange} required />
          <FormInputDate label="Rehearsal End Date" value={inputs.RehearsalEndDate} name="RehearsalEndDate" onChange={handleOnChange} required />
          <ThumbnailUpload path={inputs.Logo} setPath={((Logo) => setInputs({ ...inputs, Logo }))} />
          <input id="ShowId"
            type="hidden"
            name="ShowId"
            onChange={handleOnChange}
            required
            value={parseInt(String(show))}
            contentEditable={false}
          />
          <FormButtonSubmit text="Add Tour" disabled={status.submitted} loading={status.submitting} />
        </form>
      </FormContainer>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const show = ctx.params.ShowId as string
  return { props: { show } }
}

export default Create
