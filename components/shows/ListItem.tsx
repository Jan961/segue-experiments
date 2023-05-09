import React from "react";
import Link from "next/link";

import { Show } from "../../interfaces";
import { router } from "next/client";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { event } from "next/dist/build/output/log";
import UpdateShow from "./forms/updateShow";
import Image from "next/image";
import axios from "axios";
import { forceReload } from "../../utils/forceReload";

type Props = {
  data: Show;
};

const deleteShow = (ShowId) => {
  axios({
    method: "POST",
    url: "/api/shows/delete/" + ShowId,
    data: ShowId,
  })
    .then((response) => {
      console.log("Marked " + ShowId + " As deleted");
      forceReload();
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
};

// @ts-ignore
const ListItem = ({ data }: Props) => (
  <div className="flex items-center px-4 py-2 sm:px-4">
    <div className="flex min-w-0 flex-1 items-center">
      <div className="flex-shrink-0">
        {data.Logo !== null && (
          <Image
            src={`/segue/logos/${data.Logo}`}
            alt={data.Name}
            width="200"
            height="50"
          ></Image>
        )}
        {data.Logo == null && (
          <Image
            src="/segue/logos/segue_logo.png"
            alt={data.Name}
            width="200"
            height="50"
          ></Image>
        )}
      </div>
      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4 content-center justify-self-start">
        <div>
          <p className="text-lg text-center text-primary-blue font-bold">
            {data.Name} - ({data.Code})
          </p>
          <p className="mt-2 flex items-center text-sm text-gray-500"></p>
        </div>

        <div>
          <Link href="/tours/[ShowId]" as={`/tours/${data.ShowId}`}>
            <button
              className="bg-primary-green text-white hover:bg-green-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded  hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              View Tours
            </button>
          </Link>
          <UpdateShow items={data}></UpdateShow>
          <button
            className="bg-red-600 text-white hover:bg-red-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => deleteShow(data.ShowId)}
          >
            <FontAwesomeIcon icon={faTrash as IconProp} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ListItem;
