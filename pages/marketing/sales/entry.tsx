import Link from "next/link";
import Layout from "../../../components/Layout";
import Toolbar from "../../../components/marketing/venue/toolbar";
import SideMenu from "../../../components/sideMenu";
import { Show, User } from "../../../interfaces";
import { GetStaticPaths, GetStaticProps } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactElement, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Status from "../../../components/marketing/venue/status";
import Entry from "../../../components/marketing/sales/entry";
import EmailLoader from "../../../components/marketing/sales/email-loader";

type Props = {
  items: Show[];
};
const pagetitle = "Marketing - Sale Entry";

const Index = ({ items }: Props) => {
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <Layout title={pagetitle + "| Seque"}>
      <div className="flex flex-col px-4 flex-auto">
        <Toolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={pagetitle}
        ></Toolbar>    
        <Entry searchFilter={searchFilter}></Entry>
      </div>
    </Layout>
  );
};

export default Index;
