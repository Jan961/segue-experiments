import Layout from 'components/Layout'
import { ShowList } from 'components/shows/ShowList'
import { SearchBox } from 'components/global/SearchBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import { GetServerSideProps } from 'next'
import { getShows } from 'services/ShowService'
import React, { Fragment, PropsWithChildren } from 'react'
import { Show } from 'interfaces'
import { showMapper } from 'interfaces/mappers'
import { Tab } from '@headlessui/react'
import classNames from 'classnames'

interface ShowsProps {
  shows: Show[]
}

const StyledTab = ({ children }: PropsWithChildren<unknown>) => {
  const commonClass = 'p-2 px-4 rounded mr-2'

  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button className={selected ?
          classNames('bg-primary-blue text-white', commonClass) :
          classNames('bg-gray-300 bg-opacity-50', commonClass)
        } >
          { children}
        </button>
      )}
    </Tab>
  )
}

export default function Index ({ shows }: ShowsProps) {
  const [search, setSearch] = React.useState('')

  const query = search.toLowerCase()

  const active = []
  const archived = []

  for (const show of shows) {
    if (show.Code?.toLowerCase().includes(query) || show.Name?.toLowerCase().includes(query)) {
      if (show.archived) archived.push(show)
      else active.push(show)
    }
  }

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
      <Tab.Group className='max-w-screen-md mx-auto' as='div'>
        <Tab.List className="mb-4">
          <StyledTab>Active ({active.length})</StyledTab>
          <StyledTab>Archived ({archived.length})</StyledTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel><ShowList items={active} /></Tab.Panel>
          <Tab.Panel><ShowList items={archived} /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

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
