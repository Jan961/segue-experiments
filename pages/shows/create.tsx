import { useState } from 'react'
import axios from 'axios'
import { userService } from 'services/user.service'
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
import { FormInputUpload } from 'components/global/forms/FormInputUpload'

const Create = () => {
  const userAccount = userService.userValue.accountId

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    Code: '',
    ShowId: '',
    Name: '',
    ShowType: '',
    AccountId: userAccount
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
        Name: inputs.Name,
        ShowType: inputs.ShowType,
        AccountId: userAccount
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
      })
      .catch((error) => {
        loggingService.logError(error)
        handleServerResponse(false, error.response.data.error)
      })
  }

  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]

      setImage(i)
      setCreateObjectURL(URL.createObjectURL(i))
    }
  }

  return (
    <Layout title="Add Show | Segue">
      <FormContainer>
        <div className="mb-4">
          <Link href="/shows"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Create Show
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInputText label="Code" name="Code" value={inputs.Code} onChange={handleOnChange} placeholder="XYZABC" required />
          <FormInputText label="Name" name="Name" value={inputs.Name} onChange={handleOnChange} required />
          <FormInputSelect label="ShowType" name="ShowType" value={inputs.ShowType} required onChange={handleOnChange} options={showTypes} />
          <FormInputUpload label="Show Logo" name="Logo" onChange={uploadToClient} />
          <input id="AccountId"
            type="hidden"
            name="AccountId" />
          <FormButtonSubmit disabled={status.submitted} loading={status.submitting} text="Create" />
        </form>
      </FormContainer>
    </Layout>
  )
}

export default Create
