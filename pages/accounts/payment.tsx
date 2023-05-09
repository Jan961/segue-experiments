import Link from 'next/link'
import Layout from '../../components/Layout'
import {Show, User} from "../../interfaces";
import AccountPaymentDetails from "../../components/accounts/forms/paymentDetails";


type Props = {
    items: Show[]
}

const Index = ({ items }: Props) => (
    <Layout title="Payment | Seque">
        <AccountPaymentDetails></AccountPaymentDetails>
    </Layout>
)


export default Index
