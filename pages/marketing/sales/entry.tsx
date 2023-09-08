import Layout from '../../../components/Layout'
import Toolbar from '../../../components/marketing/venue/toolbar'
import { Show } from '../../../interfaces'
import { useState } from 'react'
import Entry from '../../../components/marketing/sales/entry'

type Props = {
  items: Show[];
};
const pagetitle = 'Marketing - Sale Entry'

const Index = ({ items }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <Layout title={pagetitle + '| Seque'}>
      <div className="flex flex-col px-4 flex-auto">
        <Toolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={pagetitle}
        ></Toolbar>
        <Entry searchFilter={searchFilter}></Entry>
      </div>
    </Layout>
  )
}

export default Index
