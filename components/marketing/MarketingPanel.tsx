import { SalesTab } from './tabs/SalesTab'
import { ArchivedSalesTab } from './tabs/ArchivedSalesTab'
// import { Summary } from './Summary'
import { ActivitiesTab } from './tabs/ActivitiesTab'
import { ContactNotesTab } from './tabs/ContactNotesTab'
import { VenueContactsTab } from './tabs/VenueContactsTab'
import { PromoterHoldsTab } from './tabs/PromoterHoldsTab'
import ActionBar from './ActionBar'
import { Tab } from '@headlessui/react'
import { StyledTab } from 'components/global/StyledTabs'
import { Summary } from './Summary'

const MarketingPanel = () => {
  return (
    <div className={'flex md:flex-col'}>
      <ActionBar />
      <br />
      <Tab.Group as='div' className="mt-5">
        <Tab.List className="mb-2">
          <StyledTab>Sales</StyledTab>
          <StyledTab>Archived Sales</StyledTab>
          <StyledTab>Activities</StyledTab>
          <StyledTab>Contact Notes</StyledTab>
          <StyledTab>Venue Contacts</StyledTab>
          <StyledTab>Promoter Holds</StyledTab>
        </Tab.List>
        <div className='grid grid-cols-12 gap-2 overflow-hidden mt-5'>
          <div className='col-span-4 md:col-span-3 lg:col-span-2 h-full overflow-y-auto' style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Summary />
          </div>
          <div className="col-span-8 md:col-span-9 lg:col-span-10 mb-4 overflow-y-auto mt-2">
            <Tab.Panels>
              <Tab.Panel><SalesTab/></Tab.Panel>
              <Tab.Panel><ArchivedSalesTab /></Tab.Panel>
              <Tab.Panel><ActivitiesTab /></Tab.Panel>
              <Tab.Panel><ContactNotesTab /></Tab.Panel>
              <Tab.Panel><VenueContactsTab /></Tab.Panel>
              <Tab.Panel><PromoterHoldsTab /></Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  )
}

export default MarketingPanel
