import Link from "next/link";
import Layout from "../../../components/Layout";
import Toolbar from "../../../components/contracts/toolbar";
import { Show, User } from "../../../interfaces";
import { GetStaticPaths, GetStaticProps } from "next";
import { sampleShowData } from "../../../utils/sample-data";
import { ReactElement, useEffect, useState } from "react";
import ContractDetailsForm from "../../../components/contracts/contractDetailsForm";
import ContractListingPanel from "../../../components/contracts/contractListingPanel";
import { useRouter } from "next/router";
import { IBooking } from "types/BookingTypes";

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => {
  const [activeContractIndex, setActiveContractIndex] = useState<number|null>(null);
  const [tourData, setTourData] = useState<IBooking[] | []>([]);
  let router = useRouter();
  const { showId, tourId } = router.query;
  const apiRoute = () => `/api/bookings/read/${showId}/${tourId}`;
  async function fetchTourData() {
    const result = await fetch(apiRoute());
    if (result) {
      let parsedResults = await result.json();
      setTourData(parsedResults);
    }
  }

  function incrementActiveContractIndex (){
    if(activeContractIndex < (tourData.length +1))
    setActiveContractIndex(activeContractIndex+1)
  }

  useEffect(() => {
    fetchTourData();
  }, [tourId]);


//   useEffect(() => {
// console.log("the booking id ", tourData[activeContractIndex].BookingId)  }, [activeContractIndex]);





  return (
    <Layout title="Contracts | Seque">
      <div className=" px-2 sm:px-4 md:px-6 lg:px-12 pt-6 flex flex-auto flex-col w-full">
        {/* <SideMenu/> */}
      <Toolbar></Toolbar>
      <div className="flex-row flex">

        <ContractListingPanel activeContractIndex={activeContractIndex} tourData={tourData} setActiveContractIndex={setActiveContractIndex}></ContractListingPanel>
        {activeContractIndex &&
        <ContractDetailsForm  incrementActiveContractIndex={incrementActiveContractIndex} activeContract={tourData[activeContractIndex].BookingId}></ContractDetailsForm>
      } 
      </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: Show[] = sampleShowData;
  return { props: { items } };
};
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default Index;
