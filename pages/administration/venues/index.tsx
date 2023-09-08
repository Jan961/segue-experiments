import Link from "next/link";
import Layout from "../../../components/Layout";
import Venuelist from "../../../components/accounts/venues/venuelist";
import VenueForm from "../../../components/accounts/venues/venueForm";
import { GetStaticProps } from "next";
import { Venue } from "../../../interfaces";

import { PrismaClient } from "@prisma/client";
import ExcelExport from "../../../components/administration/venues/excelExport";
import { useEffect, useState } from "react";


type Props = {
  items: Venue[];
};

// @ts-ignore
const Index = () => {

  const [items, setItems] = useState<Venue[]>([]);
  async function getVenues() {
    try {
        

    // TBC   Change to dynamic based on User
    const response = await fetch('/api/venue')
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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
          <span className="block xl:inline">Administrator: Manage Venues</span>
        </h1>

        <VenueForm></VenueForm>
        <ExcelExport items={items}></ExcelExport>

        <Venuelist items={items}></Venuelist>
      </div>
    </Layout>
  );
}

export default Index
