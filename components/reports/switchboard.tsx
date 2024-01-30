import MasterPlan from './modals/masterPlan';
import SalesVsCapacity from './modals/SalesVsCapacity';
import ProductionGrossSales from './modals/ProductionGrossSales';
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
  activeProductions: any[];
};

const Header = ({ children }: PropsWithChildren<unknown>) => <h2 className="text-lg mb-2 text-center">{children}</h2>;

export default function Switchboard({ activeProductions }: SwitchboardProps) {
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
            <SalesSummarySimple activeProductions={activeProductions}></SalesSummarySimple>
            <SalesSummaryWeekly activeProductions={activeProductions}></SalesSummaryWeekly>
            <SalesVsCapacity activeProductions={activeProductions}></SalesVsCapacity>
            <ProductionGrossSales activeProductions={activeProductions}></ProductionGrossSales>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-pink bg-opacity-25 p-4 rounded-xl">
          <Header>Holds And Comps</Header>
          <ul className="grid grid-cols-1 gap-4">
            <PromotorHolds activeProductions={activeProductions}></PromotorHolds>
            <HoldsComps activeProductions={activeProductions}></HoldsComps>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-purple bg-opacity-25 p-4 rounded-xl">
          <Header>Productions and Venues</Header>
          <ul className="grid grid-cols-1 gap-4">
            <SelectedVenues activeProductions={activeProductions}></SelectedVenues>
          </ul>
        </div>

        <div className="col-span-1 bg-primary-orange bg-opacity-25 p-4 rounded-xl">
          <Header>Activities</Header>
          <ul className="grid grid-cols-1 gap-4">
            <OutstandingActivities activeProductions={activeProductions}></OutstandingActivities>
            <MasterplanReport></MasterplanReport>
            <ActivityLog></ActivityLog>
          </ul>
        </div>
      </div>
    </div>
  );
}
