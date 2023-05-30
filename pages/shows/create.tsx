import { useState } from 'react'
import axios from 'axios'
import { loggingService } from 'services/loggingService'
import Layout from 'components/Layout'
import { FormContainer } from 'components/global/forms/FormContainer'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FormInputText } from 'components/global/forms/FormInputText'
import showTypes from 'data/showTypes.json'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { useRouter } from 'next/router'
import { ShowDTO } from 'interfaces'
import { BreadCrumb } from 'components/global/BreadCrumb'

const DEFAULT_SHOW: ShowDTO = {
  Code: '',
  Name: '',
  Type: '',
  IsArchived: false
}

const Create = () => {
  const router = useRouter()

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState(DEFAULT_SHOW)

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
    e.persist()

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
      url: '/api/shows/create',
      data: inputs
    })
      .then((response) => {
        loggingService.logAction('Show', 'Show Created')
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )
        router.push('/shows')
      })
      .catch((error) => {
        loggingService.logError(error)
        handleServerResponse(false, error.response.data.error)
      })
  }

  return (
    <Layout title="Add Show | Segue">
      <BreadCrumb>
        <BreadCrumb.Item href="/">
          Home
        </BreadCrumb.Item>
        <BreadCrumb.Item href="/shows">
          Shows
        </BreadCrumb.Item>
        <BreadCrumb.Item>
          Add Show
        </BreadCrumb.Item>
      </BreadCrumb>
      <FormContainer>
        <form onSubmit={handleOnSubmit}>
          <FormInputText label="Code" name="Code" value={inputs.Code} onChange={handleOnChange} placeholder="XYZABC" required />
          <FormInputText label="Name" name="Name" value={inputs.Name} onChange={handleOnChange} required />
          <FormInputSelect label="Show Type" name="Type" value={inputs.Type} required onChange={handleOnChange} options={showTypes} />
          {/* <ThumbnailUpload path={inputs.Logo} setPath={((Logo) => setInputs({ ...inputs, Logo }))} /> */}
          <FormButtonSubmit disabled={status.submitted} loading={status.submitting} text="Create" />
        </form>
      </FormContainer>
    </Layout>
  )
}

export default Create
