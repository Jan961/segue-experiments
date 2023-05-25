import { useState } from 'react'
import axios from 'axios'
import { loggingService } from 'services/loggingService'
import Layout from 'components/Layout'
import { getShowById } from 'services/ShowService'
import { GetServerSideProps } from 'next'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FormContainer } from 'components/global/forms/FormContainer'
import showTypes from 'data/showTypes.json'
import { useRouter } from 'next/router'
import { showMapper } from 'interfaces/mappers'
import { ShowDTO } from 'interfaces'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'

type Props = {
  show: ShowDTO
}

const EditShow = ({ show }: Props) => {
  const router = useRouter()

  const [status, setStatus] = useState({
    submitted: true,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({ ...show })

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
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))
    axios({
      method: 'POST',
      url: '/api/shows/update/' + show.Id,
      data: inputs
    }).then((response) => {
      loggingService.logAction('Show', 'Show Updated')

      handleServerResponse(
        true,
        'Thank you, your message has been submitted.'
      )

      router.push('/shows')
    }).catch((error) => {
      loggingService.logError(error)

      handleServerResponse(false, error.response.data.error)
    })
  }

  return (
    <Layout title="Edit Show | Segue">
      <FormContainer>
        <div className="mb-4">
          <Link href="/shows"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Edit: {show.Name}
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInputText label="Code" name="Code" value={inputs.Code} onChange={handleOnChange} placeholder="XYZABC" required />
          <FormInputText label="Name" name="Name" value={inputs.Name} onChange={handleOnChange} required />
          <FormInputSelect label="Show Type" name="Type" value={inputs.Type} onChange={handleOnChange} options={showTypes} required />
          <FormInputCheckbox label="Archived" name="IsArchived" value={inputs.IsArchived} onChange={(handleOnChange)} />
          {/* <ThumbnailUpload path={inputs.Logo} setPath={((Logo) => setInputs({ ...inputs, Logo }))} /> */}
          <FormButtonSubmit disabled={status.submitted} loading={status.submitting} text="Save Changes" />
        </form>
      </FormContainer>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const showId = ctx.params.ShowId as string
  const show = await getShowById(parseInt(showId))

  return { props: { show: showMapper(show) } }
}

export default EditShow
