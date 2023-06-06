import Layout from '../../components/Layout'
import { Show } from '../../interfaces'
import { useState } from 'react'
import MarketingPanel from '../../components/marketing/marketing-panel'
import GlobalToolbar from 'components/toolbar'

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <Layout title="Marketing | Seque">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={'Marketing'}
        />
        <MarketingPanel></MarketingPanel>
      </div>
    </Layout>
  )
}

export default Index
