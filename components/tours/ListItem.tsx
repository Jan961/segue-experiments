import React from "react";
import Link from "next/link";

import { Show, Tour } from "../../interfaces";
import Image from "next/image";
import UpdateShow from "../shows/forms/updateShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import UpdateTour from "./forms/updateTour";
import axios from "axios";
import {forceReload} from "../../utils/forceReload";
import {loggingService} from "../../services/loggingService";

type Props = {
  data: Tour;
};

function deleteTour(TourId: number) {
    axios({
        method: 'POST',
        url: '/api/tours/delete/' + TourId,
        data: TourId,
    })
        .then((response) => {
            console.log("Marked " + TourId + " As deleted" )
            loggingService.logAction("Tour","Deleted" + TourId)
            forceReload()

        })
        .catch((error) => {
            console.log(JSON.stringify(error))
            loggingService.logError( error)
        });
}

const ListItem = ({ data }: Props) => (
<div className="flex items-center px-4 py-2 sm:px-4">
  <div className="flex min-w-0 flex-1 items-center">
    <div className="flex-shrink-0">
      {data.logo ? (
        <Image
          src={`${data.logo}`}
          alt={data.Show.Name}
          width="200"
          height="50"
        />
      ) : (
        <Image
          src="/segue/logos/segue_logo.png"
          alt={data.Show.Name}
          width="200"
          height="50"
        />
      )}
    </div>
    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4 content-center justify-self-start">
        <div>
          <p className="text-sm text-gray-900">
            {data.Show.Name} ({data.Show.Code}) - Tour {data.Code}
          </p>
          <p className="mt-2 flex items-center text-sm text-gray-500">
            Rehearsals {convertDate(data.TourStartDate)} &#12297;
            {convertDate(data.RehearsalEndDate)} | Touring:{" "}
            {convertDate(data.TourStartDate)} &#12297;
            {convertDate(data.TourEndDate)} | Tour id: {data.TourId}
          </p>
        </div>

      <div className="flex items-center justify-end">
      <Link href={`/bookings/${data.Show.Code}/${data.Code}`}>
          <button
            className="bg-primary-green text-white hover:bg-green-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded  hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            View Bookings
          </button>
        </Link>
        <UpdateTour items={data} />
        <button
          className="bg-red-600 text-white hover:bg-red-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => deleteTour(data.TourId)}
        >
          <FontAwesomeIcon icon={faTrash as IconProp} />
        </button>
      </div>
    </div>
  </div>
</div>
);

export default ListItem;

/**
 *
 * Simple Date Formatting
 *
 * @param date
 * @constructor
 */
function convertDate(date) {
  let convertedDate = new Date(date).toISOString().slice(0, 10);
  return convertedDate.toString();
}


{/* <div className="flex items-center px-4 py-2 sm:px-4">
  <div className="flex min-w-0 flex-1 items-center">
    <div className="flex-shrink-0">
      {data.logo !== null ? (
        <Image
          src={`/segue/logos/${data.logo}`}
          alt={data.name}
          width="200"
          height="50"
        />
      ) : (
        <Image
          src="/segue/logos/segue_logo.png"
          alt={data.name}
          width="200"
          height="50"
        />
      )}
    </div>
    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4 content-center justify-self-start">
        <div>
          <p className="text-sm text-gray-900">
            {data.Show.Name} ({data.Show.Code}) - Tour {data.Code}
          </p>
          <p className="mt-2 flex items-center text-sm text-gray-500">
            Rehearsals {convertDate(data.TourStartDate)} &#12297;
            {convertDate(data.RehearsalEndDate)} | Touring:{" "}
            {convertDate(data.TourStartDate)} &#12297;
            {convertDate(data.TourEndDate)} | Tour id: {data.TourId}
          </p>
        </div>

      <div className="flex items-center justify-end">
      <Link href={`/bookings/${data.Show.Code}/${data.Code}`}>
          <button
            className="bg-primary-green text-white hover:bg-green-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded  hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            View Bookings
          </button>
        </Link>
        <UpdateTour items={data} />
        <button
          className="bg-red-600 text-white hover:bg-red-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => deleteTour(data.ShowId)}
        >
          <FontAwesomeIcon icon={faTrash as IconProp} />
        </button>
      </div>
    </div>
  </div>
</div> */}