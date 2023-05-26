import { useState } from 'react'
import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { SearchBox } from 'components/global/SearchBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MenuButton } from 'components/global/MenuButton'
import { getShowWithToursById } from 'services/ShowService'
import { Tab } from '@headlessui/react'
import { StyledTab } from 'components/global/StyledTabs'
import TourList from 'components/tours/TourList'
import { tourMapper } from 'interfaces/mappers'
import { TourDTO } from 'interfaces'

type Props = {
  tours: TourDTO[]
  id: number
};

export default function Tours ({ id, tours }: Props) {
  const [query, setQuery] = useState('')

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
        <MenuButton href={`/tours/create/${id}`} iconRight={faPlus}>Add Tour</MenuButton>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-primary-blue block xl:inline">Tours</span>
      </h1>
      <Tab.Group className='max-w-screen-md mx-auto' as='div'>
        <Tab.List className="mb-4">
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowId } = ctx.params
  const show = await getShowWithToursById(parseInt(ShowId as string))
  const tours = tourMapper(show)

  return { props: { tours, id: show.Id } }
}
