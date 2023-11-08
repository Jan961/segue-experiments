import MasterPlan from './modals/masterPlan';
import SalesVsCapacity from './modals/SalesVsCapacity';
import TourGrossSales from './modals/TourGrossSales';
import SalesSummaryWeekly from './modals/SalesSummaryWeekly';
import PromotorHolds from './modals/PromotorHolds';
import HoldsComps from './modals/HoldsComps';
import OutstandingActivities from './modals/OutstandingActivities';
import MasterplanReport from './modals/MasterplanReport';
import ActivityLog from './modals/ActivityLog';
import SelectedVenues from './modals/SelectedVenues';
import SalesSummarySimple from './modals/SalesSummarySimple';
import { PropsWithChildren } from 'react';

type SwitchboardProps = {
  activeTours: any[];
};

const Header = ({ children }: PropsWithChildren<unknown>) => <h2 className="text-lg mb-2 text-center">{children}</h2>;

export default function Switchboard({ activeTours }: SwitchboardProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-bold text-primary-blue text-4xl my-4">Reports</h1>
      <ul className="w-80 mx-auto pb-8">
        <MasterPlan></MasterPlan>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="col-span-1 bg-primary-green to-transparent bg-opacity-25 p-4 rounded-xl">
          <Header>Sales and Marketing</Header>
          <ul className="grid grid-cols-1 gap-4">
            <SalesSummarySimple activeTours={activeTours}></SalesSummarySimple>
            <SalesSummaryWeekly activeTours={activeTours}></SalesSummaryWeekly>
            <SalesVsCapacity activeTours={activeTours}></SalesVsCapacity>
            <TourGrossSales activeTours={activeTours}></TourGrossSales>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-pink bg-opacity-25 p-4 rounded-xl">
          <Header>Holds And Comps</Header>
          <ul className="grid grid-cols-1 gap-4">
            <PromotorHolds activeTours={activeTours}></PromotorHolds>
            <HoldsComps activeTours={activeTours}></HoldsComps>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-purple bg-opacity-25 p-4 rounded-xl">
          <Header>Tours and Venues</Header>
          <ul className="grid grid-cols-1 gap-4">
            <SelectedVenues activeTours={activeTours}></SelectedVenues>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-orange bg-opacity-25 p-4 rounded-xl">
          <Header>Activities</Header>
          <ul className="grid grid-cols-1 gap-4">
            <OutstandingActivities activeTours={activeTours}></OutstandingActivities>
            <MasterplanReport></MasterplanReport>
            <ActivityLog></ActivityLog>
          </ul>
        </div>
      </div>
    </div>
  );
}
