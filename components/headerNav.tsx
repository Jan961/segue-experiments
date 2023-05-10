import * as React from "react";
import { Router, useRouter } from "next/router";
import { userService } from "../services/user.service";
import user from "./accounts/manage-users/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function headerNav({menuIsOpen, setMenuIsOpen}:any) {
  const [username, setUsername] = React.useState("My Account")
  const router = useRouter();

  function logout() {
    userService.logout();
    router.push("/"); 
  }
  let user = userService.userValue;
  React.useEffect(() => {
    
    if(user && user.name){
      setUsername(user.name)
    }
  
  
  }, [user]);





  return (
      <nav className=" bg-none">
        <div className="  px-2 sm:px-4 " >
          <div className="flex h-16 justify-between items-center">
            <div onClick={() => setMenuIsOpen(!menuIsOpen)} className="flex items-center">
              <img
                className="sticky h-24 w-auto"
                src="/segue/logos/segue_logo.png"
                alt="Your Company"
              />
            </div>
            <div className="flex flex-row items-center">
              <a
                href="/"
                className="border-indigo-500 rounded-full text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                aria-current="page"
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="mr-2 text-white rounded-full bg-primary-green  p-1 "
                />
                Platform Home
              </a>
              <span className="mx-2">{" | "}</span>
              <a
                href="/accounts"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="mr-2 text-white rounded-full bg-primary-orange p-1"
                />
                {username}
              </a>
              <span className="mx-2">{" | "}</span>
              <button
              onClick={logout}
              className=" border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="mr-2 bg-primary-purple text-white rounded-full bg-primary-red p-1"
              />
              Log Out
            </button>
            </div>
          </div>
        </div>
      </nav>
  );
}

export default headerNav;


