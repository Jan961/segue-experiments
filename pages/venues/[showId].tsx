import Layout from 'components/Layout'
import Venuelist from 'components/account/venues/venuelist'
import { Venue } from 'interfaces'
import { useEffect, useState } from 'react'

type Props = {
  items: Venue[];
};

function Index ({ items }: Props) {
  const [venues, setVenues] = useState([])

  useEffect(() => {
    async function getVenueData () {
      try {
        // TBC CHANGE HARDCODED VALUE FOR DYNAMIC USER
        const response = await fetch('/api/venue')
        if (response.ok) {
          const data = await response.json()
          console.log('the venue response: ', data)
          setVenues(data)
        } else {
          throw new Error()
        }
      } catch (error) {
        console.error(error)
      }
    }
    getVenueData()
  }, [])

  return (
    <Layout title="Account | Segue">
      <div className="w-full flex-row flex">
        <div className="w-full px-2 md:px-8 lg:px-12">
          <section className="flex flex-row justify-between pb-32">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-4xl mt-5 text-left">
              <span className="block xl:inline text-primary-orange">ST1/22 - Admin (Venues)
              </span></h1>
            <div className="flex flex-row">
              <select className="rounded-md drop-shadow-md" name='filter' id='filter'>
                <option>
              Select Filter
                </option>
              </select>
            </div>
          </section>
          <section>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-4xl mt-5 text-left">
              <span className="block xl:inline text-primary-orange">
                Manage Custom Venue Data
              </span>
            </h1>
            <p className="mt-6">
              Segue provides a rich database of venue information out of the
              box.{' '}
            </p>
            <p>
              {' '}
              If you would like to add your own venues, please enter those below
            </p>
          </section>

          {/* <VenueForm ></VenueForm> */}
          <div className="inline-block">
            <Venuelist items={venues}></Venuelist>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index
