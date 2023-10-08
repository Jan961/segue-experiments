import React, { useState } from 'react'
import moment from 'moment'
import { dateToSimple, getDateDaysAgo, toISO } from 'services/dateService'
import { faLineChart } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { getCurrentMondayDate, range } from 'services/reportsService'
import { SwitchBoardItem } from 'components/global/SwitchBoardItem'
import { Spinner } from 'components/global/Spinner'

type Props = {
  activeTours: any[];
};

const defaultInputs = {
  Tour: null,
  TourWeek: null,
  numberOfWeeks: 2,
  order: null
}
export default function SalesSummaryWeekly ({ activeTours }: Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [tourWeeks, setTourWeeks] = useState([]) // Shory list of tours for the toolbar to switch
  const [inputs, setInputs] = useState(defaultInputs)

  const closeModal = () => {
    setShowModal(false)
    setInputs(defaultInputs)
  }

  function formatShortYearDate (dateString) {
    const dateMomentObject =
      moment(dateString) ||
      moment(moment(dateString).format('DD/MM/YY'), 'DD/MM/YY') // 1st argument - string, 2nd argument - format
    const day = toISO(dateMomentObject as any).substring(0, 10)
    return day // new Date( dateMomentObject.toDate());
  }

  function handleOnSubmit (e) {
    e.preventDefault()
    const selectedTour = activeTours.find(
      (tour) => tour.Id === parseInt(inputs.Tour)
    )
    const toWeek = formatShortYearDate(inputs.TourWeek)
    const fromWeek = formatShortYearDate(
      getDateDaysAgo(toWeek, inputs.numberOfWeeks * 7)
    )
    setLoading(true)
    fetch('/api/reports/sales-summary-simple', {
      method: 'POST',
      body: JSON.stringify({
        tourId: parseInt(inputs.Tour, 10),
        fromWeek,
        toWeek,
        isWeeklyReport: true
      })
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const tourName: string = selectedTour?.name
          let suggestedName: string | any[] = response.headers.get(
            'Content-Disposition'
          )
          if (suggestedName) {
            suggestedName = suggestedName.match(/filename="(.+)"/)
            suggestedName = suggestedName.length > 0 ? suggestedName[1] : null
          }
          if (!suggestedName) {
            suggestedName = `${tourName}.xlsx`
          }
          const content = await response.blob()
          if (content) {
            const anchor: any = document.createElement('a')
            anchor.download = suggestedName
            anchor.href = (window.webkitURL || window.URL).createObjectURL(
              content
            )
            anchor.dataset.downloadurl = [
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              anchor.download,
              anchor.href
            ].join(':')
            anchor.click()
          }
          closeModal()
        }
      })
      .finally(() => {
        setLoading(true)
      })
  }

  function handleOnChange (e) {
    if (e.target.name === 'Tour') {
      setTourWeeks([])
      const currentTour = activeTours.find(
        (tour) => tour.Id === parseInt(e.target.value)
      )
      if (currentTour) {
        const { StartDate, EndDate } =
          currentTour.DateBlock.find((date) => date.Name === 'Tour') || {}
        setInputs((prev) => ({
          ...prev,
          tourStartDate: StartDate,
          tourEndDate: EndDate
        }))
      }
      setLoading(true)
      axios
        .get(`/api/reports/tourWeek/${e.target.value}`)
        .then((res) => res.data)
        .then((data) => {
          // Make sure tour weeks are empty
          setTourWeeks([])
          // Set tour weeks with data
          setTourWeeks(data || [])
          const currentWeekMonday = getCurrentMondayDate()
          setInputs((prev) => ({ ...prev, TourWeek: currentWeekMonday }))
        })
        .finally(() => {
          setLoading(false)
        })
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faLineChart,
          title: 'Sales Summary Weekly',
          onClick: () => setShowModal(true),
          color: 'bg-primary-green'
        }}
      />
      {
        showModal
          ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10">
                <div className="relative w-auto my-6 mx-auto max-w-6xl">
                  {/* content */}
                  <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/* header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                    Sales Summary + Weekly
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={closeModal}
                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                        </span>
                      </button>
                    </div>
                    {/* body */}
                    {loading && (
                      <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
                        <Spinner className="w-full" size="lg" />
                      </div>
                    )}
                    <form onSubmit={handleOnSubmit}>
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="date" className="">
                      Tour
                        </label>

                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.Tour}
                          id="Tour"
                          name="Tour"
                          onChange={handleOnChange}
                        >
                          <option key="default">Select a Tour</option>
                          {activeTours.map((tour, i) => (
                            <option key={i} value={`${tour.Id}`}>
                              {tour.ShowCode}{tour.Code} | {tour.ShowName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">
                      Tour Week
                        </label>

                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.TourWeek}
                          id="TourWeek"
                          name="TourWeek"
                          onChange={handleOnChange}
                        >
                          <option key="default">Select a Tour Week</option>
                          {tourWeeks.map((week) => (
                            <option
                              key={week.TourWeekId}
                              value={`${week.mondayDate}`}
                            >
                              {/* {formatWeekNumber(week.WeekCode)}  */}
                              {` Wk ${week.tourWeekNum} | ${dateToSimple(week?.mondayDate)}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">
                      Number of weeks
                        </label>
                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.numberOfWeeks}
                          id="numberOfWeeks"
                          name="numberOfWeeks"
                          onChange={handleOnChange}
                        >
                          <option key="default">Select number of weeks</option>
                          {range(2, 99).map((week, i) => (
                            <option key={i} value={week}>
                              {week}
                            </option>
                          ))}
                        </select>
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
                          type="submit"
                        >
                          {' '}
                      Generate Excel Report
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
