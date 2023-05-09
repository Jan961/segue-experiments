import * as React from "react";
import { Router } from "next/router";
import { userService } from "../services/user.service";
import user from "./accounts/manage-users/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";

function headerNav({menuIsOpen, setMenuIsOpen}:any) {
  function logout() {
    userService.logout();
  }
  let user = userService.userValue;

  // return (
  //     <>
  //         <nav className="bg-transparent shadow-sm">
  //             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  //                 <div className="flex h-16 justify-between">
  //                     <div className="flex">
  //                         <div className="flex flex-shrink-0 items-center">
  //                             <img className="block h-8 w-auto lg:hidden"
  //                                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
  //                                  alt="Your Company"/>
  //                             <img className="hidden h-8 w-auto lg:block"
  //                                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
  //                                  alt="Your Company"/>
  //                         </div>
  //                         <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">

  //                         </div>
  //                     </div>
  //                     <div className="hidden sm:ml-6 sm:flex sm:items-center">
  //                         <a href="/"
  //                            className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
  //                            aria-current="page">Platform Home</a>

  //                         <a href="/shows"
  //                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Shows</a>
  //                         <a href="/tasks"
  //                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Tasks</a>
  //                         <a href="/reports"
  //                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Reports</a>
  //                         <a href="/profile"
  //                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Profile</a>

  //                         <a href="/accounts"
  //                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Segue Account</a>

  //                             <a href="/administration"
  //                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                                 Global Administration</a>

  //                         <a onClick={logout}  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
  //                             Logout</a>
  //                     </div>

  //                 </div>
  //             </div>

  //         </nav>
  //     </>
  // )
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
            <div >
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
                Your Account
              </a>
            </div>
          </div>
        </div>
      </nav>
  );
}

export default headerNav;
