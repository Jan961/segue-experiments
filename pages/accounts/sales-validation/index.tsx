import Link from 'next/link'
import Layout from '../../../components/Layout'
import {Show, User} from "../../../interfaces";
import {GetStaticPaths, GetStaticProps} from "next";
import {sampleShowData} from "../../../utils/sample-data";
import AccountDetails from "../../../components/accounts/forms/accountDetails";
import SalesDataValidation from "../../../components/accounts/forms/salesDataValidation";


type Props = {
    items: Show[]
}

// @ts-ignore

const Index = ({ items }: Props) => (

    <Layout title="Booking | Seque">
        <SalesDataValidation></SalesDataValidation>
    </Layout>
)


export default Index
