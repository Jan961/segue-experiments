import { useState } from 'react'
import Sales from './tabs/sales'
import ArchiveSales from './tabs/ArchiveSales'
import Summary from './summary'
import Activities from './tabs/activites'
import ContactNotes from './tabs/contact-notes'
import VenueContacts from './tabs/venue-contacts'
import PromoterHolds from './tabs/hold'
import ActionBar from './ActionBar'
import { Tab } from '@headlessui/react'
import { StyledTab } from 'components/global/StyledTabs'

export interface ActionBookingId {
  actionBookingId: null | number;
}

const MarketingPanel = (Tour) => {
  return (
    <div className={'flex md:flex-col'}>
      <ActionBar />
      <br />
      <Tab.Group as='div'>
        <Tab.List className="mb-2">
          <StyledTab>Sales</StyledTab>
          <StyledTab>Archived Sales</StyledTab>
          <StyledTab>Activities</StyledTab>
          <StyledTab>Contact Notes</StyledTab>
          <StyledTab>Venue Contacts</StyledTab>
          <StyledTab>Promoter Holds</StyledTab>
        </Tab.List>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Summary/>
          </div>
          <div className="col-span-3">
            <Tab.Panels>
              <Tab.Panel><Sales/></Tab.Panel>
              <Tab.Panel><ArchiveSales /></Tab.Panel>
              <Tab.Panel><Activities /></Tab.Panel>
              <Tab.Panel><ContactNotes /></Tab.Panel>
              <Tab.Panel><VenueContacts /></Tab.Panel>
              <Tab.Panel><PromoterHolds /></Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  )
}

export default MarketingPanel
