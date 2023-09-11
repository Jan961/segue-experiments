import { useState } from 'react'
import Barring from './barring'
import Contacts from './contacts'
import Details from './details'
import TechnicalDetails from './technicalDetails'
import { Venue } from 'interfaces'

type Props = {
  items: Venue;
};

const tabs = [
  { name: "Venue Details", href: "#", current: true },
  { name: "Venue Technical Information", href: "#", current: false },
  { name: "Barring", href: "#", current: false },
  { name: "Venue Contacts", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function showTab(tab) {
  //
}

const Panel = ({ items }: Props) => {
  const [ShowDetails, setShowDetails] = useState(true);
  const [ShowTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [ShowBarring, setShowBarring] = useState(false);
  const [ShowContacts, setShowContacts] = useState(false);

  function changeActive(tab) {
    tab.current = false;
  }
  function showTab(tab) {
    tabs.forEach(changeActive);

    setShowDetails(false);
    setShowTechnicalDetails(false);
    setShowBarring(false);
    setShowContacts(false);

    if (tab.name == "Venue Details") {
      setShowDetails(true);
    }
    if (tab.name == "Venue Technical Information") {
      setShowTechnicalDetails(true);
    }
    if (tab.name == "Barring") {
      setShowBarring(true);
    }
    if (tab.name == "Venue Contacts") {
      setShowContacts(true);
    }
    tab.current = true;
  }

  return (
    <div className={"flex md:flex-col"}>
      <div className={"flex md:flex-col  mt-5 "}>
        <div className="sm:hidden">
          {tabs.map((tab) => (
            <button onClick={() => showTab({ tab })}>{tab.name}</button>
          ))}
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                onClick={() => showTab(tab)}
                key={tab.name}
                className={classNames(
                  tab.current
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700",
                  "px-3 py-2 font-medium text-sm rounded-t-md"
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
      <div className={"flex flex-row"}>
        {ShowDetails ? <Details items={items}></Details> : null}
        {ShowTechnicalDetails ? (
          <TechnicalDetails items={items}></TechnicalDetails>
        ) : null}
        {ShowBarring ? <Barring items={items}></Barring> : null}
        {ShowContacts ? <Contacts></Contacts> : null}
      </div>
    </div>
  );
};

export default Panel;
