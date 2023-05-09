import Link from 'next/link'
import Layout from '../../../../components/Layout'
import Venuelist from "../../../../components/accounts/venues/venuelist";
import VenueForm from "../../../../components/accounts/venues/venueForm";
import {GetStaticPaths, GetStaticProps} from "next";
import {Venue} from "../../../../interfaces";

import { PrismaClient } from '@prisma/client'
import Panel from "../../../../components/accounts/venues/edit/panel";
import {userService} from "../../../../services/user.service";

const prisma = new PrismaClient()

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


export const getStaticProps: GetStaticProps = async ctx => {

    const  venueID  = parseInt(ctx.params.venueId as string) || {}
    let  account_id =userService.userValue.accountId; //todo: programmatically assign this
    const venues = await prisma.venue.findFirstOrThrow(
        {
            where: {
                OR: [
                    {
                        AccountId: 0
                    },
                    {
                        AccountId: account_id
                    },
                ],
                deleted: 0,
                VenueId: venueID,
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export default venueId
