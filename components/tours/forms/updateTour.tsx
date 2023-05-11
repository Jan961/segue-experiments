import React, { useState } from 'react'
import axios from 'axios'
import { Tour } from '../../../interfaces'
import { forceReload } from '../../../utils/forceReload'
import { userService } from '../../../services/user.service'
import { loggingService } from '../../../services/loggingService'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'

type Props = {
    items: Tour
}

export default function UpdateTour ({ items }: Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const owner = userService.userValue.accountId

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    Code: items.Code,
    ShowId: items.ShowId,
    TourStartDate: items.TourStartDate,
    TourEndDate: items.TourStartDate,

    RehearsalStartDate: items.RehearsalStartDate,
    RehearsalEndDate: items.RehearsalEndDate,
    logo: items.logo,
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
  const closeModal = () => {
    forceReload()
    setShowModal(false)
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
      url: '/api/tours/update/' + items.TourId,
      data: inputs
    })
      .then((response) => {
        // @ts-ignore
        loggingService.logAction('Tour', 'Update')
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )
        forceReload()
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        loggingService.logError(error)
        handleServerResponse(false, error.response.data.error)
      })
  }

  // @ts-ignore
  return (
    <>
      <MenuButton icon={faPencil} onClick={() => setShowModal(true)} />
      { showModal
        ? (
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
                                        Update {items.Show.Name} {items.TourId}
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
                            type="text"
                            name="TourStartDate"
                            onChange={handleOnChange}
                            required
                            value={convertDate(inputs.TourStartDate)}
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
                            value={convertDate(inputs.TourEndDate)}
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
                            value={convertDate(inputs.RehearsalStartDate)}
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
                            value={convertDate(inputs.RehearsalEndDate)}
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                          />
                        </div>
                        <div>
                          <label htmlFor="Tour Logo" className="">Tour Logo</label>
                          <img src={createObjectURL} height="200px" width="200px"/>
                          <input id="logo"
                            type="file"
                            name="logo"
                            onChange={handleOnChange}
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                          />
                        </div>

                      </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={closeModal}
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
                  {/** }
                                 {status.info.error && (
                                    <div className="bg-red-800 text-black">Error: {status.info.msg}</div>
                                )}
                                 {!status.info.error && status.info.msg && <p>{status.info.msg}</p>}
                                 */}
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )
        : null}
    </>
  )

  function convertDate (date) {
    const convertedDate = new Date(date).toISOString().slice(0, 10)
    return convertedDate.toString()
  }
}
