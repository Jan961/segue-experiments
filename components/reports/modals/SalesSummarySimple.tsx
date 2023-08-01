import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import IconWithText from '../IconWithText'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { getDateDaysAgo, toISO } from 'services/dateService'

type Props={
  activeTours:any[];
  activeTour:any;
}

type TourWeek = {
  Id:number,
  MondayDate:string,
}

export default function SalesSummarySimple ({ activeTours, activeTour }:Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [tourWeeks, setTourWeeks] = useState<TourWeek[]>([])
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })
  const [inputs, setInputs] = useState({
    tour: null,
    tourWeek: null,
    numberOfWeeks: null,
    order: null,
    tourStartDate: null,
    tourEndDate: null
  })

  const fetchTourWeek = async (tourId:number) => {
    const weeks:TourWeek[] = await fetch(`/api/reports/tourWeek/${tourId}`).then(data => data.json()).then(data => data.data)
    setTourWeeks(weeks)
  }
  function weeksBefore (date, weeks) {
    return getDateDaysAgo(date, weeks)
  }

  function formatShortYearDate (dateString) {
    const dateMomentObject = moment(dateString) || moment(moment(dateString).format('DD/MM/YY'), 'DD/MM/YY') // 1st argument - string, 2nd argument - format
    const day = toISO(dateMomentObject as any).substring(0, 10)
    return day // new Date( dateMomentObject.toDate());
  }
  const downloadReport = async () => {
    const selectedTour = activeTours.find(tour => tour.Id === parseInt(inputs.tour))
    const toWeek = formatShortYearDate(inputs.tourWeek)
    const fromWeek = formatShortYearDate(weeksBefore(toWeek, inputs.numberOfWeeks * 7))
    // /api/reports/v1/call/salesSummary/s/s/s/s/s/s?type=1
    fetch('/api/reports/sales-summary-simple', { method: 'POST', body: JSON.stringify({ tourId: inputs.tour, fromWeek, toWeek }) }).then(async response => {
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
          tour: null,
          tourWeek: null,
          numberOfWeeks: null,
          order: null,
          tourStartDate: null,
          tourEndDate: null
        })
      }
    })
  }
  useEffect(() => {
    if (inputs.tour) {
      fetchTourWeek(inputs.tour)
    }
  }, [inputs.tour])

  function handleOnSubmit (e) {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))
    downloadReport()
  };

  function handleOnChange (e) {
    if (e.target.name === 'tour') {
      setTourWeeks([])
      const currentTour = activeTours.find(tour => tour.Id === parseInt(e.target.value))
      if (currentTour) {
        const { StartDate, EndDate } = currentTour.DateBlock.find(date => date.Name === 'Tour') || {}
        setInputs(prev => ({ ...prev, tourStartDate: StartDate, tourEndDate: EndDate }))
      }
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  };
  return (
    <>
      <IconWithText
        icon={faChartPie}
        text={'Sales Summary'}
        onClick={() => setShowModal(true)}
      />
      {
        showModal
          ? (
            <>
              <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                &#8203;
                  </span>
                  <div
                    className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    <div className="sm:flex justify-center">

                      <div className="mt-3 justify-center text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-xl text-center leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                            Sales Summary Simple
                        </h3>
                      </div>
                      <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <span className="sr-only">Close</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                      <div className="mt-6">
                        <label htmlFor="date" className="text-lg font-medium">
                          Tour
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.tour}
                          id="tour"
                          name="tour"
                          onChange={handleOnChange}
                        >
                          <option>Select a Tour</option>
                          {activeTours?.map?.((tour) => (
                            <option key={tour.Id} value={`${tour.Id}`}>
                              {tour.ShowCode}/{tour.Code} | {tour.ShowName}
                            </option>
                          ))}
                        </select>

                      </div>
                      <div className="mt-6">
                        <label htmlFor="date" className="text-lg font-medium">
                            Tour Week
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.tourWeek}
                          id="tourWeek"
                          name="tourWeek"
                          onChange={handleOnChange}
                        >
                          <option>Select a Tour Week</option>
                          {tourWeeks.map((week) => (
                            <option
                              key={week.MondayDate}
                              value={`${week.MondayDate}`}
                            >
                              {moment(week.MondayDate).format('YYYY-MM-DD')}{' '}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-6">
                        <label htmlFor="date" className="text-lg font-medium">
                            Number of weeks
                        </label>
                        <select
                          className="block w-full min-w-0 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.numberOfWeeks}
                          id="numberOfWeeks"
                          name="numberOfWeeks"
                          onChange={handleOnChange}
                        >
                          <option>Select a timespan</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>
                          <option value={7}>7</option>
                          <option value={8}>8</option>
                          <option value={9}>9</option>
                          <option value={10}>10</option>
                        </select>
                      </div>

                      <div className="flex flex-col my-4">
                        <label htmlFor="date" className="text-lg font-medium">
                            Order
                        </label>
                        <select
                          className="block w-full min-w-0 flex-1  shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.order}
                          id="order"
                          name="Order"
                          onChange={handleOnChange}
                        >
                          <option value={'date'}>Show Date</option>
                          <option value={'sales'}>
                              Show Sales (Low to Highest)
                          </option>
                          <option value={'change'}>
                              Change (Lowest to highest)
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                            Close and Discard
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit"
                        >
                          {!status.submitting
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {

    }
  }
}
