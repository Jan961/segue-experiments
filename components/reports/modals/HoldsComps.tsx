import React, { useState } from 'react'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import IconWithText from '../IconWithText'

type Props={
    activeTours:any[];
}
export default function HoldsComps ({ activeTours }:Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [inputs, setInputs] = useState({
    dateFrom: null,
    dateTo: null,
    tour: null,
    venue: null,
    status: null
  })
  const [venues, setVenues] = useState([])

  function handleOnSubmit (e) {
    e.preventDefault()
    downloadReport()
  }

  function closeForm () {
    setInputs({
      dateFrom: null,
      dateTo: null,
      tour: null,
      venue: null,
      status: null
    })
    setVenues([])
    setShowModal(false)
  }

  const downloadReport = async () => {
    const selectedTour = activeTours.find(tour => tour.Id === parseInt(inputs.tour))

    if (!selectedTour) return

    fetch('/api/reports/holds-comps', {
      method: 'POST',
      body: JSON.stringify({
        TourId: selectedTour.Id,
        tourCode: `${selectedTour?.ShowCode}${selectedTour?.Code}`,
        fromDate: inputs.dateFrom,
        toDate: inputs.dateTo,
        venue: inputs.venue,
        bookingStatus: inputs.status
      })
    }).then(async response => {
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
          dateFrom: null,
          dateTo: null,
          tour: null,
          venue: null,
          status: null
        })
      }
    })
  }

  async function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))

    if (e.target.name === 'tour') {
      // Load Venues for this tour
      setVenues([])
      await fetch(`api/tours/read/venues/${e.target.value}`)
        .then((res) => res.json())
        .then(data => data.data)
        .then((data) => {
          setInputs(prevState => ({ ...prevState, Venue: null }))
          setVenues(data)
        })
    }
  }

  return (
    <>
      <IconWithText icon={faUsers} text={'Holds & Comps'} onClick={() => setShowModal(true)}/>
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
                         Holds & Comps
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
                          <option>Select a Tour</option>
                          {
                            activeTours.map((tour) => (
                              <option key={tour.Id} value={tour.Id} >{tour.ShowCode}/{tour.Code} | {tour.ShowName}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="dateFrom" className="">From Date</label>
                        <input
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.dateFrom}
                          id="dateFrom"
                          name="dateFrom"
                          type="date"
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="dateTo" className="">To Date</label>
                        <input
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.dateTo}
                          id="dateTo"
                          name="dateTo"
                          type="date"
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">Venue</label>
                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.venue}
                          id="venue"
                          name="venue"
                          onChange={handleOnChange}>
                          <option key={'all'} value={null}>All</option>
                          {venues.map((venue) => (
                            <option key={venue.Id} value={venue.Code}>{venue.Name}</option>
                          ))
                          }
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">Selection</label>
                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.status}
                          id="status"
                          name="status"
                          onChange={handleOnChange}>
                          <option key={'all'} value={null}>All</option>
                          <option key={'C'} value={'C'}>Confirmed</option>
                          <option key={'U'} value={'U'}>Unconfirmed</option>
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
                          type="submit" > Generate Excel Report
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
