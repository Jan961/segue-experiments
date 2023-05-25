import Layout from 'components/Layout'
import Toolbar from 'components/contracts/toolbar'
import { ShowDTO } from 'interfaces'
import { GetServerSideProps } from 'next'
import { sampleShowData } from 'utils/sample-data'
import { useEffect, useState } from 'react'
import ContractDetailsForm from 'components/contracts/contractDetailsForm'
import ContractListingPanel from 'components/contracts/contractListingPanel'
import { useRouter } from 'next/router'
import { IBooking } from 'types/BookingTypes'

type Props = {
  items: ShowDTO[];
};

const Index = ({ items }: Props) => {
  const [activeContractIndex, setActiveContractIndex] = useState<number|null>(null)
  const [tourData, setTourData] = useState<IBooking[] | []>([])
  const router = useRouter()
  const { showId, tourId } = router.query
  const apiRoute = () => `/api/bookings/read/${showId}/${tourId}`
  async function fetchTourData () {
    const result = await fetch(apiRoute())
    if (result) {
      const parsedResults = await result.json()
      setTourData(parsedResults)
    }
  }

  function incrementActiveContractIndex () {
    if (activeContractIndex < (tourData.length + 1)) { setActiveContractIndex(activeContractIndex + 1) }
  }

  useEffect(() => {
    fetchTourData()
  }, [tourId])

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
        <ContractDetailsForm incrementActiveContractIndex={incrementActiveContractIndex} activeContract={tourData[activeContractIndex].BookingId}></ContractDetailsForm>
          }
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items = sampleShowData
  return { props: { items } }
}

export default Index
