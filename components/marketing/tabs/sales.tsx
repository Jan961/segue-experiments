import * as React from "react";
import {
  faBook,
  faSquareXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionBookingId } from "../marketing-panel";
import { useEffect, useState } from "react";

const sales = [
  {
    week: -1,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
  {
    week: -2,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
  {
    week: -3,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
  {
    week: -4,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
  {
    week: -5,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
  {
    week: -6,
    weekOf: "10/10/2023",
    seatsSold: 0,
    seatSoldPC: 1,
    reservations: 0,
    reserved: 0,
    valueChange: 0,
    seatsChange: 0,
    totalHolds: 0,
  },
];

interface Props{
  actionBookingId: number|null
}

const Sales = ({actionBookingId}:Props) => {
  const [bookingSales, setBookingSales] = useState([]);
  

  useEffect(() => {
    if(actionBookingId){
      getBookingSales()
    }

  }, []);

  async function getBookingSales(){
    try {
        const response = await fetch(`/api/marketing/sales/read/${actionBookingId}`)

        if (response.ok){
          let data = await response.json()
          console.log("bookingSale data: ", data)
          setBookingSales(data)
        }
    } catch (error:any) {
      console.error(error)
    }
  }
  
  return(
  <div className={"flex bg-transparent w-9/12 "}>
    <div className="flex-auto mx-4  overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-primary-green ">
            <th
              scope="col"
              className="py-3.5 p1-4 pr-3 text-center text-sm font-normal text-white  sm:pl-6"
            >
              Week
            </th>
            <th
              scope="col"
              className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border lg:table-cell"
            >
              Week of
            </th>
            <th
              scope="col"
              className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
            >
              Seat Sold (n)
            </th>
            <th
              scope="col"
              className="hidden px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border sm:table-cell"
            >
              Seat Sold %
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Reservations (n)
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Reserved (%)
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Total Value
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Value Change
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Total Hold
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Seats Change
            </th>
            <th
              scope="col"
              className="px-1 py-3.5 text-center text-sm font-normal text-white border-l-white border"
            >
              Activity
            </th>
          </tr>
        </thead>
        <tbody className=" bg-white">
          {sales.map((sale, idx) => (
            <tr key={sale.week} className={idx%2 ===0?"bg-white":"bg-gray-50"}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white  border border-l-0 sm:w-auto sm:max-w-none sm:pl-6">
                {sale.week}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 lg:table-cell">
                {sale.weekOf}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                {sale.seatsSold}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 border border-gray-200 sm:table-cell">
                {/* TO BE ADDED {sale.seatsSold.percentage} */}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {sale.reservations}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {sale.reserved}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {/* TO BE ADDED {sale.totalValue} */}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {sale.valueChange}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {sale.totalHolds}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 border border-gray-200">
                {sale.seatsChange}
              </td>
              <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 border border-gray-200 border-r-0">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="sr-only">Single Seat</span>
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faBook} />
                  <span className="sr-only">, Brochure Released</span>
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faSquareXmark} />
                  <span className="sr-only">Not on Sale</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
}

export default Sales;
