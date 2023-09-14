import { GetServerSideProps } from 'next'
import { getActiveTours } from 'services/TourService'
import Layout from '../../components/Layout'
import Switchboard from '../../components/reports/switchboard'
import { tourEditorMapper } from 'lib/mappers'
import { getAccountIdFromReq } from 'services/userService'
import { Tour } from '@prisma/client'

type ReportsProps={
    activeTours: any & Tour[];
}

const Index = ({ activeTours = [] }:ReportsProps) => {
  return (
    <Layout title="ShowId | Segue">
      <div className="flex flex-col flex-auto">
        <h1 className="text-2xl align-middle text-primary-blue font-bold">
          Reports
        </h1>
        <Switchboard activeTours={activeTours}></Switchboard>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req)
  const activeTours = await getActiveTours(AccountId)
  return {
    props: {
      activeTours: activeTours.map((tour: any & Tour) => tourEditorMapper(tour))
    }
  }
}

export default Index
