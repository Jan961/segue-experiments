import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { Venue } from 'interfaces'
import Panel from 'components/account/venues/edit/panel'
import { userService } from 'services/user.service'
import prisma from 'lib/prisma'

type Props = {
    items: Venue
}

const venueId = ({ items }: Props) => (
  <Layout title="Account | Segue">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
      <span className="block xl:inline">Manage Venues: {items.Name}</span>
    </h1>

    <Panel items={items}></Panel>

  </Layout>
)

export const getServerSideProps: GetServerSideProps = async ctx => {
  const venueID = parseInt(ctx.params.venueId as string) || {}
  const AccountId = userService.userValue.accountId // todo: programmatically assign this
  const venues = await prisma.venue.findFirstOrThrow(
    {
      where: {
        OR: [
          {
            AccountId: 0
          },
          {
            AccountId
          }
        ],
        deleted: 0,
        VenueId: venueID
      }
    }
  )

  // @ts-ignore
  const item: Venue = venues
  // return { props: { items } }
  return {
    props: {
      items: JSON.parse(JSON.stringify(item)) // <===
    }
  }
}

export default venueId
