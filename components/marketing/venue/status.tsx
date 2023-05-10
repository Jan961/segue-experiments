import * as React from "react";
import { tourService } from "../../../services/TourService";
import { useEffect, useState } from "react";
import Loading from "../../global/loading";
import Link from "next/link";

const venues = [
  {
    code: "C12233",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "C12233",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "C1wre33",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "43534",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "C1442233",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "C12243433",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "C1442233",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "df556",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
  {
    code: "g4423",
    name: "Grand Hall",
    town: "townsville",
    country: "England",
    seats: "1592",
    sold: "20",
    asof: "06/08/2022",
  },
];

export default function Status({ searchFilter}) {
  const [tourVenues, setTourVenues] = useState([]);
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:3000/api/marketing/venue/status/4`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let filteredVenues = data.filter((venue, index, self) => {
          for (const key in venue.Venue) {
            if (venue.Venue.hasOwnProperty(key)) {
              const value = venue.Venue[key];
              if (typeof value === "string" && value.toLowerCase().includes(searchFilter.toLowerCase())) {
                return true;
              }
              if ((typeof value === "number" || value instanceof Date) && value.toString().toLowerCase().includes(searchFilter.toLowerCase())) {
                return true;
              }
            }
          }
          return false;
        });
  
        // Remove duplicates
        filteredVenues = filteredVenues.filter(
          (venue, index, self) =>
            index === self.findIndex((v) => v.Venue.Code === venue.Venue.Code)
        );
  
        setTourVenues(filteredVenues);
        setLoading(false);
      });
  }, [searchFilter]);


  if (isLoading) return <Loading></Loading>;

  return (
    <div className={"flex w-full"}>
      <div className="flex-auto  mt-0 overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <div className={"mb-1"}></div>
        <table className=" min-w-full rounded-tl-lg divide-gray-300">
          <thead className="bg-primary-green divide-y divide-x-2 divide-gray-300">
            <tr className="divide-x">
              <th
                scope="col"
                className="py-3.5 rounded-tl-md pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6"
              >
                Code
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6"
              >
                Name of Venue
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white lg:table-cell"
              >
                Town
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white sm:table-cell"
              >
                Country
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white sm:table-cell"
              >
                Seats
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white sm:table-cell"
              >
                Sold
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-semibold text-white"
              >
                As Of
              </th>
              <th
                scope="col"
                className="rounded-tr-md px-3 py-3.5 text-center text-sm font-semibold text-white"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-x divide-gray-200 bg-white">
            {tourVenues.map((venue, idx) => (
              <tr className={`${idx%2 ===0 ?'bg-white':'bg-gray-50'} divide-x divide-gray-300`} key={venue.Venue.Code}>
                <td className="w-full  py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:w-auto  sm:pl-6">
                  {venue.Venue.Code}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {venue.Venue.Name}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {venue.Venue.Town ?? '-'}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {venue.Venue.Country}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {venue.Venue.Seats}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {venue.Venue.SeatsSold ?? '0000'}
                </td>
                <td className="px-3 py-4 text-sm text-center text-gray-500">
                  {venue.Venue.asof ?? '00/00/0000'}
                </td>
                <td className="px-3 py-4 text-sm text-center text-gray-500">
                  <Link href={"#"}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  );
}
