import Layout from 'components/Layout'
import { SearchBox } from 'components/global/SearchBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import { Tab } from '@headlessui/react'
import { StyledTab } from 'components/global/StyledTabs'
import TourList from 'components/tours/TourList'
import { TourDTO } from 'interfaces'
import { BreadCrumb } from 'components/global/BreadCrumb'
import React from 'react'
import { useRouter } from 'next/router'
import { title } from 'radash'

type Props = {
  tours: TourDTO[]
  code: string
  name: string
};

export const Tours = ({ code, tours, name }: Props) => {
  const [query, setQuery] = React.useState('')
  const router = useRouter()
  const path = router.pathname.split('/')[1]

  const active = []
  const archived = []

  for (const tour of tours) {
    if (tour.Code?.toLowerCase().includes(query) || tour.ShowName?.toLowerCase().includes(query)) {
      if (tour.IsArchived) archived.push(tour)
      else active.push(tour)
    }
  }

  return (
    <Layout title="Tours | Segue">
      <div className="float-right">
        <SearchBox onChange={(e) => setQuery(e.target.value)} value={query} />
        <MenuButton href={`/tours/create/${code}?path=${path}`} iconRight={faPlus}>Add Tour</MenuButton>
      </div>
      <BreadCrumb>
        <BreadCrumb.Item href="/">
          Home
        </BreadCrumb.Item>
        <BreadCrumb.Item href={`/${path}`}>
          { title(path) }
        </BreadCrumb.Item>
        <BreadCrumb.Item>
          { name }
        </BreadCrumb.Item>
      </BreadCrumb>
      <Tab.Group className='max-w-screen-md mx-auto' as='div'>
        <Tab.List className="mb-2">
          <StyledTab>Active ({active.length})</StyledTab>
          <StyledTab>Archived ({archived.length})</StyledTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel><TourList items={active} /></Tab.Panel>
          <Tab.Panel><TourList items={archived} /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}
