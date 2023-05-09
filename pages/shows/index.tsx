import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import List from "../../components/shows/List";
import { Show, User } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import NewShow from "../../components/shows/forms/newShow";
import { userService } from "../../services/user.service";

/**
 * Send search request to the API
 *
 * @param query
 */
const searchEndpoint = (query, archived) =>
  `/api/shows/search/${query}/${archived}`;

export default function Index() {
  const [archived, setArchived] = useState(false);
  const [data, setData] = useState<Show[]>([]);
  const [user, setUser] = useState(userService.userValue);
  const [searchQuery, setSearchQuery] = useState(" ");
  const [isLoading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    search: " ",
  });

  useEffect(() => {
    setLoading(true);
    setArchived(false);
    fetch(searchEndpoint(searchQuery, archived))
      .then((res) => res.json())
      .then((res) => {
        setData(res.searchResults);
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

  return (
    <>
      <Layout title="Shows | Seque">
        <div className="columns-3">
          <div>&nbsp;</div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-primary-blue block xl:inline">Shows</span>
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
        <div className={" max-w-3/4 justify-center flex flex-col items-center"}>
          <div className="max-w-full w-3/4 justify-start flex flex-row">
            <NewShow></NewShow>
          </div>
          <List items={data} />
        </div>
      </Layout>
    </>
  );
}
