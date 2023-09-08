import Layout from '../../../components/Layout'
import { Venue } from '../../../interfaces'
import { useEffect, useState } from 'react'

// @ts-ignore
const Index = () => {
  const [items, setItems] = useState<Venue[]>([])
  async function getVenues () {
    try {
      // TBC   Change to dynamic based on User
      const response = await fetch('/api/venue')
      if (response.ok) {
        const venueItems = await response.json()
        setItems(venueItems)
      } else {
        throw new Error('Error fetching Venues')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getVenues()
  }, [])
  return (
    <Layout title="Account | Segue">
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-4xl mt-5 text-center">
          <span className="block lg:inline">Administrator: Manage Dropdown Input values</span>
        </h1>
        <div>

        </div>
      </div>
    </Layout>
  )
}

export default Index
