import React, {useCallback} from 'react'
// import SideNavBar from '../sideMenu'
import MasterPlan from './modals/masterPlan'
import SalesSummary from './modals/SalesSummary'
import SalesVsCapacity from './modals/SalesVsCapacity'
import TourGrossSales from './modals/TourGrossSales'
import SalesSummaryWeekly from './modals/SalesSummaryWeekly'
import PromotorHolds from './modals/PromotorHolds'
import HoldsComps from './modals/HoldsComps'
import OutstandingActivities from './modals/OutstandingActivities'
import MasterplanReport from './modals/MasterplanReport'
import ActivityLog from './modals/ActivityLog'
import SelectedVenues from './modals/SelectedVenues'
import SalesSummaryFix from './modals/SalesSummaryFix'
import SalesSummarySimple from './modals/SalesSummarySimple'

/* <SideNavBar></SideNavBar> */

type SwitchboardProps={
  activeTours:any[];
  activeTour:any;
}

export default function Switchboard ({ activeTours, activeTour }:SwitchboardProps) {
  return (
    <div className=" justify-center flex align-center  flex-row">
      <div className={'md:w-3/4 sm:w-4/5 flex align-center py-4 flex-col content-center'}>
        <div className={'grid grid-cols-1 mb-4'}>
          <MasterPlan></MasterPlan>
        </div>
        <div className={' bg-slate-100 py-4 flex justify-center flex-row'}>
          <div className={'flex-col w-full'}>
            <div className={'flex flex-row space-x-4 justify-center text-center text-gray-500'}>
              <h2>Sales and Marketing</h2>
            </div>
            <div className={'flex flex-row py-4 justify-between px-6'}>
              <SalesSummarySimple activeTour={activeTour} activeTours={activeTours}></SalesSummarySimple>
              {/* <SalesSummary activeTours={activeTours}></SalesSummary> */}
              {/* <SalesSummaryFix activeTours={activeTours}></SalesSummaryFix> */}
              <SalesSummaryWeekly activeTours={activeTours}></SalesSummaryWeekly>
              <SalesVsCapacity activeTours={activeTours}></SalesVsCapacity>
              <TourGrossSales activeTours={activeTours}></TourGrossSales>
            </div>
          </div>
        </div>
        <div className={'flex flex-row py-4 justify-center'}>
          <div className={'flex-col w-full'}>
            <div className={'flex justify-center flex-row space-x-4 text-gray-500'}>
              <h2>Tours and Venues</h2>
            </div>
            <div className={'grid grid-cols-1 mt-4 space-x-4 '}>
              <SelectedVenues activeTours={activeTours}></SelectedVenues>
            </div>
          </div>
        </div>
        <div className={' bg-slate-100 py-4 flex flex-row justify-center '}>
          <div className={'flex-col w-full'}>
            <div className={'flex flex-row space-x-4 justify-center text-center text-gray-500'}>
              <h2>Holds And Comps</h2>
            </div>
            <div className={' grid grid-cols-2 mt-4 w-full'}>
              <PromotorHolds activeTours={activeTours}></PromotorHolds>
              <HoldsComps activeTours={activeTours}></HoldsComps>
            </div>
          </div>
        </div>
        <div className={'flex py-4 flex-row justify-center hidden'}>
          <div className={'flex-col w-full'}>
            <div className={'flex flex-row space-x-4 justify-center text-center text-gray-500'}>
              <h2>Activities</h2>
            </div>
            <div className={' grid grid-cols-3 mt-4 w-full'}>
              <OutstandingActivities activeTours={activeTours}></OutstandingActivities>
              <MasterplanReport ></MasterplanReport>
              <ActivityLog ></ActivityLog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
