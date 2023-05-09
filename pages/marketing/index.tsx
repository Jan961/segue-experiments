import Link from "next/link";
import Layout from "../../components/Layout";
import Toolbar from "../../components/marketing/ActionBar";
import BookingDetailsForm from "../../components/bookings/bookingDetailsForm";
import SideMenu from "../../components/sideMenu";
import BookingDetailsListingPanel from "../../components/bookings/bookingListingPanel";
import { Show, User } from "../../interfaces";
import { GetStaticPaths, GetStaticProps } from "next";
import { sampleShowData } from "../../utils/sample-data";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactElement, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import MarketingPanel from "../../components/marketing/marketing-panel";
import GlobalToolbar from "components/toolbar";
import ActionBar from "../../components/marketing/ActionBar";

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => {
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <Layout title="Marketing | Seque">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={"Marketing"}
        />
        <MarketingPanel></MarketingPanel>
      </div>
    </Layout>
  );
};

export default Index;
