import Layout from 'components/Layout'
import { useState } from 'react'
import MarketingPanel from 'components/marketing/marketing-panel'
import GlobalToolbar from 'components/toolbar'
import { GetServerSideProps } from 'next'
import { getToursByShowCode } from 'services/TourService'
import { TourJump } from 'state/booking/tourJumpState'
import { InitialState } from 'lib/recoil'

type Props = {
  initialState: InitialState
};

const Index = ({ initialState }: Props) => {
  console.log(initialState)
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <Layout title="Marketing | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={'Marketing'} />
        <MarketingPanel></MarketingPanel>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode, TourCode } = ctx.params

  const toursRaw = await getToursByShowCode(ShowCode as string)

  const tourJump: TourJump = {
    tours: toursRaw.map((t: any) => (
      {
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code
      })),
    selected: TourCode as string
  }

  const initialState: InitialState = {
    tourJump
  }

  return { props: { initialState } }
}

export default Index
