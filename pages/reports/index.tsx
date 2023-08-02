import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { getActiveTours } from 'services/TourService'
import Layout from '../../components/Layout'
import Switchboard from '../../components/reports/switchboard'
import Toolbar from '../../components/reports/toolbar'
import { tourEditorMapper } from 'lib/mappers'

type ReportsProps={
    activeTours:any[];
}

const Index = ({ activeTours = [] }:ReportsProps) => {
  const [show, setShow] = useState('ST1')
  const [tour, setTour] = useState('22')
  const [activeTour, setActiveTour] = useState(null);

  const onShowTourChange = (change:any) => {
    // const selectedTour
    console.log(change)
  }
  return (
    <Layout title="ShowId | Segue">
      <div className="flex flex-col flex-auto">
        <Toolbar activeTours={activeTours} show={show} tour={tour} onChange={onShowTourChange}></Toolbar>
        <Switchboard activeTour={activeTour} activeTours={activeTours}></Switchboard>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const { ShowCode, TourCode } = ctx.query as Params
  const activeTours = await getActiveTours(1)
  return {
    props: {
      activeTours: activeTours.map(tour => tourEditorMapper(tour))
    }
  }
}

export default Index
