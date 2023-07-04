import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx/xlsx.mjs'
import * as fs from 'fs'

/* load 'stream' for stream support */
import { Readable } from 'stream'

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs'
import { userService } from '../../../services/user.service'
import { toSql } from '../../../services/dateService'
import IconWithText from '../IconWithText'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
XLSX.set_fs(fs)
XLSX.stream.set_readable(Readable)
XLSX.set_cptable(cpexcel)

function formatWeekNumber (weekNumber) {
  return weekNumber.split(':')[1]
}

function formatDate (date) {
  return toSql(date)
}

type Props={
    activeTours:any[];
}

export default function SalesSummaryWeekly ({ activeTours }:Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [tourWeeks, setTourWeeks] = useState([]) // Shory list of tours for the toolbar to switch
  const [inputs, setInputs] = useState({
    Tour: null,
    TourWeek: null,
    numberOfWeeks: 2,
    order: null
  })

  function handleOnSubmit () {

  }

  function handleOnChange (e) {
    if (e.target.name === 'Tour') {
      setTourWeeks([])
      const currentTour = activeTours.find(tour => tour.Id === parseInt(e.target.value))
      if (currentTour) {
        const { StartDate, EndDate } = currentTour.DateBlock.find(date => date.Name === 'Tour') || {}
        setInputs(prev => ({ ...prev, tourStartDate: StartDate, tourEndDate: EndDate }))
      }
      fetch(`/api/reports/tourWeek/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => {
          // Make sure tour weeks are empty
          setTourWeeks([])
          // Set tour weeks with data
          setTourWeeks(data?.data || [])
        })
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      {/* TBC replace with design specific Icons */}
      <IconWithText icon={faChartLine} text={'Sales Summary Weekly'} onClick={() => setShowModal(true)}/>
      {/* <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Sales Summary Weekly
            </button> */}
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
                                        Sales Summary + Weekly
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
                          value={inputs.Tour}
                          id="Tour"
                          name="Tour"

                          onChange={handleOnChange}>

                          {activeTours.map((tour) => (
                            <option key={tour.Id} value={`${tour.Id}`} >{tour.ShowCode}/{tour.Code} | {tour.ShowName}</option>
                          ))
                          }
                        </select>

                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">Tour Week</label>

                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.TourWeek}
                          id="TourWeek"
                          name="TourWeek"

                          onChange={handleOnChange}>

                          {tourWeeks.map((week) => (

                            <option key={week.TourWeekId} value={`${week.MondayDate}`}>
                              {/* {formatWeekNumber(week.WeekCode)}  */}
                              {formatDate(week.MondayDate)}
                            </option>
                          ))
                          }
                        </select>

                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="date" className="">Number of weeks</label>

                        <select
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={inputs.numberOfWeeks}
                          id="numberOfWeeks"
                          name="numberOfWeeks"

                          onChange={handleOnChange}>

                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>

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
