import Layout from 'components/Layout'
import { ShowList } from 'components/shows/ShowList'
import { SearchBox } from 'components/global/SearchBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import { GetServerSideProps } from 'next'
import { getShows } from 'services/ShowService'
import React from 'react'
import { Show } from 'interfaces'
import { showMapper } from 'interfaces/mappers'

interface ShowsProps {
  shows: Show[]
}

export default function Index ({ shows }: ShowsProps) {
  const [search, setSearch] = React.useState('')

  const query = search.toLowerCase()
  const filteredShows = shows.filter(x => 
    x.Code?.toLowerCase().includes(query) || x.Name?.toLowerCase().includes(query)
  )

  return (
    <Layout title="Shows | Segue">
      <div className="float-right">
        <SearchBox onChange={(e) => setSearch(e.target.value)} value={search} />
        <MenuButton iconRight={faPlus} href='/shows/create'>Create Show</MenuButton>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-primary-blue block xl:inline">Shows</span>
      </h1>
      <br className='clear' />
      <div className='max-w-screen-md mx-auto'>
        <ShowList items={filteredShows} />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const shows = await getShows()

  return {
    props: {
      shows: shows.map(showMapper)
    }
  }
}
