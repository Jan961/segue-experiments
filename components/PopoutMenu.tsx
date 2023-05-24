import * as React from "react";
import { useRouter } from "next/router";
import { faBullhorn, faCalendarCheck, faChartLine, faClipboardList, faFileSignature, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PopoutMenu = ({ menuIsOpen, setMenuIsOpen }: any, data?: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

    const menuItems = [
    { label: "Bookings", link: "/bookings/FTM/22", icon:faCalendarCheck, activeColor: "text-primary-blue"  },
    {
      label: "Marketing",
      link: "#",
      icon:faBullhorn, activeColor: "text-primary-green" ,
      subItems: [
        { label: "Marketing Home", link: "/marketing" },
        { label: "Venue Data Status", link: "/marketing/venue/status/" },
        {
          label: "Venue History Entry",
          link: `/${data.Tour}/marketing/venue/status`,
        },
        { label: "Sales Entry", link: "/marketing/sales/entry" },
        { label: "Final Figures Entry", link: "/marketing/sales/final" },
        { label: "Load Sales History", link: "/marketing/sales/history-load" },
        { label: "Global Activities", link: "/marketing/activity/global" },
      ],
    },
    {
      label: "Contracts",
      link: "/contracts/2/19",
      icon:faFileSignature, activeColor: "text-primary-pink" ,
    },
    {

      label: "Reports",
      link: "/reports",
      icon:faChartLine, activeColor: "text-primary-blue" ,
    
    },
    {
      label: "Tasks",
      link: "/tasks",
      icon:faClipboardList, activeColor: "text-primary-purple" ,

    },
    {
      label: "Admin",
      link: "#",
      icon:faUserGear, activeColor: "text-primary-orange" ,
      subItems: [
        {
          label: "Venues",
          link: "/venues/20",
        },
        {
          label: "Shows",
          link: "/shows",
        },
        {
          label: "Tours",
          link: "/tours/1",
        },
      ],
    },
  ];

  return (
      <div
        className={`absolute rounded-tr-[34px] left-0 top-0 z-50 w-60 shadow-md bg-primary-navy px-1 transform ease-in-out duration-300 ${
          menuIsOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="flex items-center"
        >
          <img
            className="h-24 w-auto"
            src="/segue/segue_logo.png"
            alt="Your Company"
          />
        </div>
        <div className="overflow-y-scroll max-h-screen">

              <ul >
        {menuItems.map((menuItem, index) => {
          return (
            <li key={index} >
              <a className={`flex items-center text-sm py-4 px-6 h-12  size-md text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out text-white`} href={menuItem.link} data-mdb-ripple="true" data-mdb-ripple-color="dark">
                {menuItem.icon && (
                  <span className="mr-2">
                    <FontAwesomeIcon icon={menuItem.icon} className="h-5 w-5" />
                  </span>
                )}
                {menuItem.label}
              </a>
              {menuItem.subItems && (
                <ul className="pl-5">
                  {menuItem.subItems.map((subMenuItem, subIndex) => {
                    const isSubItemActive = data?.menuLabel === subMenuItem.label;
                    return (
                      <li key={subIndex} >
                        <a className={`flex items-center text-sm py-4 px-6 h-12 size-md text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out ${isSubItemActive ? menuItem.activeColor : 'text-white'}`} href={subMenuItem.link} data-mdb-ripple="true" data-mdb-ripple-color="dark">
                          {subMenuItem.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      </div>
      </div>
    
  );
}
