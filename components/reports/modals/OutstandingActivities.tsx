import React, { useState } from 'react'
import { faListDots } from '@fortawesome/free-solid-svg-icons'
import IconWithText from '../IconWithText'

type Props={
    activeTours:any[];
}

export default function OutstandingActivities ({ activeTours }:Props) {
  const [showModal, setShowModal] = React.useState(false)

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    Tour: null

  })

  function closeForm () {
    setInputs({
      Tour: null
    })

    setShowModal(false)
  }

  async function handleOnSubmit (e) {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))
  }

  async function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      <IconWithText icon={faListDots} text={'Outstanding Activities'} onClick={() => setShowModal(true)}/>
      {
        showModal
          ? (
            <>
              <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10"
              >
                <div className="relative w-auto my-6 mx-auto max-w-6xl">
                  {/* content */}
                  <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/* header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                                        Outstanding Activities
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
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="Tour" className="">Tour</label>
                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.Tour}
                          id="Tour"
                          name="Tour"
                          onChange={handleOnChange}>
                          <option>Select a Tour</option>
                          {activeTours.map((tour) => (
                            <option key={tour.Id} value={`${tour.Id}`} >{tour.ShowCode}/{tour.Code} | {tour.ShowName}</option>
                          ))
                          }
                        </select>
                      </div>
                      {/* footer */}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => closeForm()}
                          // THis will not save anything and discard the form
                        >
                        Close and Discard
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit" >  {!status.submitting
                            ? !status.submitted
                              ? 'Generate Excel Report'
                              : 'Downloaded'
                            : 'Creating Report...'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          )
          : null}
    </>
  )
}
