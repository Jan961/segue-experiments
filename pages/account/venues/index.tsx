import Venuelist from 'components/account/venues/venuelist'
import VenueForm from 'components/account/venues/venueForm'
import { GetServerSideProps } from 'next'
import { Venue } from 'interfaces'
import { userService } from 'services/user.service'
import prisma from 'lib/prisma'
import Layout from 'components/Layout'

type Props = {
    items: Venue[]
}

const Index = ({ items }: Props) => (
  <Layout title="Account | Segue">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
      <span className="block xl:inline">Manage Your Venues</span>
    </h1>
    <VenueForm ></VenueForm>

    <Venuelist items={items}></Venuelist>

  </Layout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const venues = await prisma.venue.findMany(
    {
      where: {
        deleted: 0,
        AccountId: userService.userValue.AccountId
      }
    }
  )

  // @ts-ignore
  const items: Venue[] = venues
  // return { props: { items } }
  return {
    props: {
      items: JSON.parse(JSON.stringify(items)) // <===
    }
  }
}

export default Index
