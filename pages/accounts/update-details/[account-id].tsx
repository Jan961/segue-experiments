import Link from 'next/link'
import Layout from '../../../components/Layout'
import {Show, User} from "../../../interfaces";
import {GetStaticPaths, GetStaticProps} from "next";
import {sampleShowData} from "../../../utils/sample-data";
import AccountDetails from "../../../components/accounts/forms/accountDetails";


type Props = {
    items: Show[]
}

// @ts-ignore

const Index = ({ items }: Props) => (

    <Layout title="Booking | Seque">
        <AccountDetails number={30} ></AccountDetails>
    </Layout>
)

export const getStaticProps: GetStaticProps = async () => {
    // Example for including static props in a Next.js function component page.
    // Don't forget to include the respective types for any props passed into
    // the component.
    const items: Show[] = sampleShowData
    return { props: { items } }
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export default Index
