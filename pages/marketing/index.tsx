import Layout from '../../components/Layout'
import { Show } from '../../interfaces'
import Link from 'next/link'

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => {
  return (
    <Layout title="Marketing | Seque">
      <Link className="text-2xl text-blue-500 undelrine" href="/marketing/JB/14">Existing Page</Link>
    </Layout>
  )
}

export default Index
