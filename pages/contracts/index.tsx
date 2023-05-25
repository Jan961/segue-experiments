import Layout from 'components/Layout'
import { ShowList } from 'components/shows/ShowList'
import { ShowDTO } from '../../interfaces'
import { GetStaticProps } from 'next'
import { sampleShowData } from '../../utils/sample-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

type Props = {
    items: ShowDTO[]
}

const Index = ({ items }: Props) => {
  (
    <Layout title="Shows | Seque">
      <div className="columns-3">
        <div>&nbsp;</div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Contracts</span>

          </h1>

        </div>
        <div className="flex flex-row">
          <div className="flex">
            <label htmlFor="display-archive" className="sr-only">Display archive shows</label>
            <input type="checkbox" id="display-archive" name="display-archive" checked/>
            <p>&nbsp; Display archived shows</p>
          </div>
          <label htmlFor="search" className="sr-only">Quick search</label>
          <div className="relative mt-1 flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch as IconProp} />
            </div>
            <input type="text" name="search" id="search"
              className="block w-full rounded-md border-black-900 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search Shows"/>
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400"></kbd>
            </div>
          </div>
        </div>

      </div>

      <ShowList items={items} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const items: ShowDTO[] = sampleShowData
  return { props: { items } }
}

export default Index
