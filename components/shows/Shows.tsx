import Layout from 'components/Layout'
import { SearchBox } from 'components/global/SearchBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import React from 'react'
import { ShowDTO } from 'interfaces'
import { Tab } from '@headlessui/react'
import { StyledTab } from 'components/global/StyledTabs'
import { ShowList } from 'components/shows/ShowList'
import { BreadCrumb } from 'components/global/BreadCrumb'
import { useRouter } from 'next/router'
import { title } from 'radash'

interface ShowsProps {
  shows: ShowDTO[]
}

export const Shows = ({ shows }: ShowsProps) => {
  const [search, setSearch] = React.useState('')
  const router = useRouter()
  const path = router.pathname.split('/')[1]

  const query = search.toLowerCase()

  const active = []
  const archived = []

  for (const show of shows) {
    if (show.Code?.toLowerCase().includes(query) || show.Name?.toLowerCase().includes(query)) {
      if (show.IsArchived) archived.push(show)
      else active.push(show)
    }
  }

  return (
    <Layout title="Shows | Segue">
      <div className="float-right">
        <SearchBox onChange={(e) => setSearch(e.target.value)} value={search} />
        <MenuButton iconRight={faPlus} href={`/shows/create?path=${path}`}>Add Show</MenuButton>
      </div>
      <BreadCrumb>
        <BreadCrumb.Item href="/">
          Home
        </BreadCrumb.Item>
        <BreadCrumb.Item>
          { title(path) }
        </BreadCrumb.Item>
      </BreadCrumb>
      <Tab.Group className='max-w-screen-md mx-auto' as='div'>
        <Tab.List className="mb-2">
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
