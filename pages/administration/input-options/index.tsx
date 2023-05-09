import Link from "next/link";
import Layout from "../../../components/Layout";
import Venuelist from "../../../components/accounts/venues/venuelist";
import VenueForm from "../../../components/accounts/venues/venueForm";
import { GetStaticProps } from "next";
import { Venue } from "../../../interfaces";

import { PrismaClient } from "@prisma/client";
import ExcelExport from "../../../components/administration/venues/excelExport";
import { useEffect, useState } from "react";
import NewValue from "components/administration/inputValues/NewValue";
import ManageInputOptions from "components/administration/inputValues/ManageInputOptions";


type Props = {
  items: Venue[];
};

// @ts-ignore
const Index = () => {

  const [items, setItems] = useState<Venue[]>([]);
  async function getVenues() {
    try {
        

    // TBC   Change to dynamic based on User
    const response = await fetch('/api/venue/read/venue/1')
    if(response.ok){
        let venueItems = await response.json();
        setItems(venueItems);
    } else {
        throw new Error('Error fetching Venues')
    }
} catch (error) {
 console.error(error)       
}
  }

  useEffect(() => {
     getVenues();
  }, []);
  return (
    <Layout title="Account | Segue">
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-4xl mt-5 text-center">
          <span className="block lg:inline">Administrator: Manage Dropdown Input values</span>
        </h1>
        <div>
            <ManageInputOptions/>
        </div>

      </div>
    </Layout>
  );
};


export default Index;