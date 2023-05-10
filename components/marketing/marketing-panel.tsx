import React, { useState } from "react";
import Sales from "./tabs/sales";
import ArchiveSales from "./tabs/ArchiveSales";
import Summary from "./summary";
import Activities from "./tabs/activites";
import ContactNotes from "./tabs/contact-notes";
import VenueContacts from "./tabs/venue-contacts";
import PromoterHolds from "./tabs/hold";
import ActionBar from "./ActionBar";

export interface ActionBookingId {
  actionBookingId: null | number;
}

const tabs = [
  { name: "Sales", href: "#", current: true },
  { name: "Archived Sales", href: "#", current: false },
  { name: "Activities", href: "#", current: false },
  { name: "Contact Notes", href: "#", current: false },
  { name: "Venue Contacts", href: "#", current: false },
  { name: "Promoter Holds", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function showTab(tab) {
  //
}

const MarketingPanel = (Tour) => {
  const [ShowSales, setShowSales] = useState(true);
  const [ShowArchiveSales, setShowArchiveSales] = useState(false);
  const [ShowActivites, setShowActivies] = useState(false);
  const [ShowContactNotes, setShowContactNotes] = useState(false);
  const [ShowVenueContact, setShowVenueContact] = useState(false);
  const [ShowPromoterHolds, setShowPromoterHold] = useState(false);
  const [tour, setTour] = useState(Tour.tour);
  const [actionBookingId, setActionBookingId] = useState(null);
  const [activeTours, setActiveTours] = useState([]);

  const handleActionBookingIdChange = (newActionBookingId) => {
    setActionBookingId(newActionBookingId);
  };

  const handleActiveToursChange = (newActiveTours) => {
    setActiveTours(newActiveTours);
  };

  function changeActive(tab) {
    tab.current = false;
  }
  function showTab(tab) {
    tabs.forEach(changeActive);

    setShowSales(false);
    setShowArchiveSales(false);
    setShowActivies(false);
    setShowContactNotes(false);
    setShowVenueContact(false);
    setShowPromoterHold(false);

    if (tab.name == "Sales") {
      setShowSales(true);
    }
    if (tab.name == "Archived Sales") {
      setShowArchiveSales(true);
    }
    if (tab.name == "Activities") {
      setShowActivies(true);
    }
    if (tab.name == "Contact Notes") {
      setShowContactNotes(true);
    }
    if (tab.name == "Venue Contacts") {
      setShowVenueContact(true);
    }
    if (tab.name == "Promoter Holds") {
      setShowPromoterHold(true);
    }
    tab.current = true;
  }

  return (
    <div className={"flex md:flex-col"}>
      <ActionBar
        onActionBookingIdChange={handleActionBookingIdChange}
        onActiveToursChange={handleActiveToursChange}
      />
      <div className={"flex md:flex-col  mt-5 "}>
        <div className="sm:hidden">
          {tabs.map((tab) => (
            <button onClick={() => showTab({ tab })}>{tab.name}</button>
          ))}
        </div>
        <div className="hidden sm:block">
          <nav className="flex " aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                onClick={() => showTab(tab)}
                key={tab.name}
                className={classNames(
                  tab.current
                    ? "bg-white text-primary-green border-primary-green border border-b-2 font-semibold"
                    : "font-normal bg-white border-primary-gray-100 border hover:text-gray-700",
                  "px-8 py-2  text-sm rounded-t-md"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className={"flex flex-col"}></div>
      <div className={"flex flex-row pt-8"}>
        <Summary actionBookingId={actionBookingId} activeTours={activeTours}/>
        {ShowSales ? <Sales actionBookingId={actionBookingId}/> : null}
        {ShowArchiveSales ? <ArchiveSales></ArchiveSales> : null}
        {ShowActivites ? <Activities></Activities> : null}
        {ShowContactNotes ? <ContactNotes></ContactNotes> : null}
        {ShowVenueContact ? <VenueContacts></VenueContacts> : null}
        {ShowPromoterHolds ? <PromoterHolds></PromoterHolds> : null}
      </div>
    </div>
  );
};

export default MarketingPanel;
