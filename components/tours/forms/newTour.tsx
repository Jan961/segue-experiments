import React, { useState } from 'react'
import Link from 'next/link'
import { JsConfigPathsPlugin } from 'next/dist/build/webpack/plugins/jsconfig-paths-plugin'

import axios from 'axios'
import { Show, Tour } from '../../../interfaces'
import { forceReload } from '../../../utils/forceReload'
import { userService } from '../../../services/user.service'
import { loggingService } from '../../../services/loggingService'
import { MenuButton } from 'components/global/MenuButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

type Props = {
    items: Tour[]
    show: number
}

export default function NewTour ({ items, show }: Props) {
  const [showModal, setShowModal] = React.useState(false)
  const owner = userService.userValue.accountId

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
    RehearsalStartDate: '',
    RehearsalEndDate: '',
    logo: null,
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
        ShowId: parseInt(String(show)),
        TourStartDate: inputs.TourStartDate,
        TourEndDate: inputs.TourEndDate,
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
  const handleOnChange = async (e) => {
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
    const fd = new FormData()
    fd.append('file', image)
    const res = await fetch('/api/fileUpload/upload', {
      method: 'POST',
      headers: {},
      body: fd
    })
    const response = await res.json()
    inputs.logo = response.data
    axios({
      method: 'POST',
      url: '/api/tours/create/',
      data: inputs
    })
      .then((response) => {
        loggingService.logAction('Tour', 'Add  Tour')
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
          // Todo: router setlocation to the new venue to allow user to add the rest fo the detils

        )
        handleClose()
      })
      .catch((error) => {
        loggingService.logError(error)
        handleServerResponse(false, error.response.data.error)
      })
  }

  const handleClose = () => {
    setShowModal(false)
    forceReload()
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

  const uploadToServer = async (event) => {
    const body = new FormData()
    body.append('file', image)
    const response = await fetch('/api/fileUpload/logo', {
      method: 'POST',
      body
    })
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <MenuButton iconRight={faPlus} onClick={() => setShowModal(true)}>
        Add Tour
      </MenuButton>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                                        Add Tour
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/* body */}
                <form onSubmit={handleOnSubmit}>
                  <div className="relative p-6 flex-auto">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className={'text-gray-700 small' }>Enter Basic Details for new Tour</p>
                      </div>
                      <div>
                        <label htmlFor="Code" className="">Code</label>

                        <input id="Code"
                          type="text"
                          name="Code"
                          onChange={handleOnChange}
                          required
                          value={inputs.Code}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="XYZABC"
                          contentEditable={false}
                        />

                      </div>
                      <div>
                        <label htmlFor="TourStartDate" className="">Tour Start Date</label>
                        <input id="TourStartDate"
                          type="date"
                          name="TourStartDate"
                          onChange={handleOnChange}
                          required
                          value={inputs.TourStartDate}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                        />
                      </div>
                      <div>
                        <label htmlFor="TourEndDate" className="">Tour End Date</label>

                        <input id="TourEndDate"
                          type="date"
                          name="TourEndDate"
                          onChange={handleOnChange}
                          required
                          value={inputs.TourEndDate}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                          contentEditable={false}
                        />

                      </div>
                      <div>
                        <label htmlFor="RehearsalStartDate" className="">Rehearsal Start Date</label>
                        <input id="RehearsalStartDate"
                          type="date"
                          name="RehearsalStartDate"
                          onChange={handleOnChange}
                          required
                          value={inputs.RehearsalStartDate}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                        />
                      </div>
                      <div>
                        <label htmlFor="RehearsalEndDate" className="">Rehearsal End Date</label>
                        <input id="RehearsalEndDate"
                          type="date"
                          name="RehearsalEndDate"
                          onChange={handleOnChange}
                          required
                          value={inputs.RehearsalEndDate}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                        />
                      </div>
                      <div>
                        <label htmlFor="Tour Logo" className="">Tour Logo</label>
                        <input id="Logo"
                          type="file"
                          name="Logo"
                          onChange={uploadToClient}

                          value={inputs.logo}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                        />
                      </div>
                      <input id="ShowId"
                        type="hidden"
                        name="ShowId"
                        onChange={handleOnChange}
                        required
                        value={parseInt(String(show))}
                        className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        contentEditable={false}
                      />

                    </div>
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                      // THis will not save anything and discard the form
                    >

                                            Close and Discard
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit" disabled={status.submitting}>
                      {!status.submitting
                        ? !status.submitted
                          ? 'Submit'
                          : 'Submitted'
                        : 'Submitting...'}
                    </button>
                  </div></form>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}
