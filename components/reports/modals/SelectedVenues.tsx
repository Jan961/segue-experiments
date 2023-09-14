import React, { useState } from 'react'
import { faMuseum } from '@fortawesome/free-solid-svg-icons'
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';

type Props={
    activeTours:any[];
}
export default function SelectedVenues ({ activeTours }:Props) {
  const [showModal, setShowModal] = React.useState(false)

  const [inputs, setInputs] = useState({
    tour: 'ALL',
    options: 'ALL'
  })

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const downloadReport = async () => {
    const selectedTour = activeTours.find(tour => tour.Id === parseInt(inputs.tour))
    fetch('/api/reports/venues', { method: 'POST', body: JSON.stringify({ tourCode: selectedTour ? `${selectedTour?.ShowCode}${selectedTour?.Code}` : null, tourId: selectedTour?.Id, showId: selectedTour?.ShowId, options: inputs.options }) }).then(async response => {
      if (response.status >= 200 && response.status < 300) {
        const tourName:string = selectedTour?.name
        let suggestedName:string|any[] = response.headers.get('Content-Disposition')
        if (suggestedName) {
          suggestedName = suggestedName.match(/filename="(.+)"/)
          suggestedName = suggestedName.length > 0 ? suggestedName[1] : null
        }
        if (!suggestedName) {
          suggestedName = `${tourName}.xlsx`
        }
        const content = await response.blob()
        if (content) {
          const anchor:any = document.createElement('a')
          anchor.download = suggestedName
          anchor.href = (window.webkitURL || window.URL).createObjectURL(content)
          anchor.dataset.downloadurl = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', anchor.download, anchor.href].join(':')
          anchor.click()
        }
        setShowModal(false)
        setInputs({
          tour: 'ALL',
          options: 'ALL'
        })
      }
    })
  }

  async function handleOnSubmit (e) {
    e.preventDefault()
    downloadReport()
  }

  function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faMuseum,
          title: 'Selected Venues',
          onClick: () => setShowModal(true),
          color: 'bg-primary-purple'
        }}
      />
      {
        showModal
          ? (
            <>
              <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll"
              >
                <div className="relative w-auto my-6 mx-auto max-w-6xl">
                  {/* content */}
                  <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/* header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                                        Selected Venues
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
                        <label htmlFor="date" className="">Tour</label>

                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.tour}
                          id="tour"
                          name="tour"

                          onChange={handleOnChange}>
                          <option key="ALL" value="ALL">All</option>
                          {activeTours.map((tour) => (
                            <option key={tour.Id} value={tour.Id} >{tour.ShowCode}/{tour.Code} | {tour.ShowName}</option>
                          ))
                          }
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">Tour</label>
                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.options}
                          id="options"
                          name="options"
                          onChange={handleOnChange}>
                          <option key="ALL" value={'null'} >All</option>
                          <option key="ON SALE" value="ON SALE" >ON SALE</option>
                          <option key="NOTONSALE" value="NOT ON SALE" >NOT ON SALE</option>
                          <option key="MARKETING PLANS RECEIVED" value="MARKETING PLANS RECEIVED" >MARKETING PLANS RECEIVED</option>
                          <option key="MARKETING PLANS NOT RECEIVED" value="MARKETING PLANS NOT RECEIVED" >MARKETING PLANS NOT RECEIVED</option>
                          <option key="CONTACT INFO RECEIVED" value="CONTACT INFO RECEIVED" >CONTACT INFO RECEIVED</option>
                          <option key="CONTACT INFO NOT RECEIVED" value="CONTACT INFO NOT RECEIVED" >CONTACT INFO NOT RECEIVED</option>
                          <option key="PRINT REQUIREMENTS RECEIVED" value="PRINT REQUIREMENTS RECEIVED" >PRINT REQUIREMENTS RECEIVED</option>
                          <option key="PRINT REQUIREMENTS NOT RECEIVED" value="PRINT REQUIREMENTS NOT RECEIVED" >PRINT REQUIREMENTS NOT RECEIVED</option>
                        </select>
                      </div>
                      {/* footer */}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                          // THis will not save anything and discard the form
                        >
                         Close
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit" > {!status.submitting
                            ? !status.submitted
                              ? 'Generate Excel Report'
                              : 'Generate Excel Report'
                            : 'Creating Report...'}
                        </button>
                      </div></form>
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
