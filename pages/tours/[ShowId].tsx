import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import Layout from "../../components/Layout";
import List from "../../components/tours/List";
import { Show, Tour, User } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import * as React from "react";

import NewShow from "../../components/tours/forms/newTour";
import { userService } from "../../services/user.service";
import NewTour from "../../components/tours/forms/newTour";
// @ts-ignore

import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

/**
 * Send search request to the API
 *
 * @param query
 */
const searchEndpoint = (query, archived) => `/api/tours/${query}`;

type Props = {
  showID: number;
};

export default function Tours({ showID }: Props) {
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState(true);
  const [active, setActive] = useState(true);
  const [data, setData] = useState<Tour[]>([]);
  const [user, setUser] = useState(userService.userValue);
  const [searchQuery, setSearchQuery] = useState(" ");
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const [inputs, setInputs] = useState({
    search: " ",
  });

  useEffect(() => {
    setLoading(true);
    fetch(searchEndpoint(showID, false))
      .then((res) => res.json())
      .then((res) => {
        setData(res);

        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  function search() {
    fetch(searchEndpoint(searchQuery, archived))
      .then((res) => res.json())
      .then((res) => {
        setData(res.searchResults);
      });
  }

  const handleOnChange = (e) => {
    e.persist();

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setSearchQuery(e.target.value);
    search();
  };
  function toggleAchive() {
    setArchived(!archived);
    search();
  }

  // @ts-ignore
  return (
    <>
      <Layout title="Tours | Seque">
        <div className="columns-3">
          <div>&nbsp;</div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-primary-blue block xl:inline">
                Tours For Show {}
              </span>
            </h1>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-row items-center mr-2">
              <label htmlFor="display-archive" className="sr-only">
                Display archive shows
              </label>
              <input
                type="checkbox"
                id="display-archive"
                name="display-archive"
                onChange={toggleAchive}
                checked={archived}
              />
              <p className="font-medium">&nbsp; Display archived shows</p>
            </div>

            <label htmlFor="search" className="sr-only">
              Quick search
            </label>
            <div className="relative mt-1 flex  items-center">
              <input
                className="block w-full rounded-md border-black-900 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search Shows"
                onChange={handleOnChange}
                type="text"
                name="search"
                id="search"
                value={inputs.search}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faSearch as IconProp} />
              </div>
            </div>
          </div>
        </div>
        <div className={"w-full flex flex-col items-center md:px-8"}>
          <div className={"w-full sm:w-4/5 md:w-3/4 flex flex-row "}>
            <NewTour show={showID} items={[]}></NewTour>
          </div>

          {data.length !== undefined && <List items={data}></List>}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  let showID = ctx.params.ShowId;

  return { props: { showID } };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
