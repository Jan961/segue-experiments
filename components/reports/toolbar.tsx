import * as React from 'react'

type Props={
  tour:string;
  show:string;
  activeTours:any[];
  onChange:(props:any)=>any;
}
const Toolbar = ({ tour, show, activeTours, onChange }:Props) => (
  <div className="mt-4 px-4">
    <div className="flex flex-row w-full justify-between" >
      <div className="bg-white drop-shadow-md flex h-full flex-row items-center rounded-md">

        <div className="border-gray-300 rounded-l-md h-full mx-2">
          <span className="align-middle">Set Tour</span>
        </div>
        <select onChange={onChange} className="text-primary-green border-gray-300 rounded-r-md font-medium">
          {
            activeTours.map(({ ShowCode, Code, Id }) => (
              <option key={Id} value={Id}>
                {ShowCode}/{Code}
              </option>
            ))
          }
          <option>
            {show}/{tour}
          </option>
        </select>
      </div>
      <div className="flex flex-row">
        <select className="rounded-md drop-shadow-md" name='filter' id='filter'>
          <option>
              Select Filter
          </option>
        </select>
      </div>
    </div>

    <div className="mt-4 flex flex-row w-full align-center justify-between" >
      <div className="inline-block">
        <h1 className="text-2xl align-middle text-primary-blue font-bold">
          {' '}
          {show} / {tour} Reports
        </h1>
      </div>

      <div className="flex flex-row">
        <form>
          <label htmlFor="searchBookings" className="sr-only">
                Search reports
          </label>
          <input
            className="border-none rounded-md"
            type="search"
            placeholder="Search reports"
          />
        </form>
      </div>

    </div>

    <div>
      <div className="col-auto">
        <div className="flex flex-row">&nbsp;</div>
        <div className="flex flex-row">&nbsp;</div>
      </div>
    </div>

    <div className="col-auto">
      <div className="col-auto">
        <div className="flex flex-row ml-0">&nbsp;</div>
      </div>
    </div>

  </div>
)

export default Toolbar
