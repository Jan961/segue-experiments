import React from 'react'
import { LoadingTab } from '../LoadingTab'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { NoDataWarning } from '../../NoDataWarning'
import { PerformanceSection } from './PerformanceSection'

export const PromoterHoldsTab = () => {
  const { selected } = useRecoilValue(bookingJumpState)
  const [loading, setLoading] = React.useState(true)

  const [performances, setPerformances] = React.useState([])

  const search = async () => {
    setLoading(true)
    const { data } = await axios.get(`/api/marketing/promoterHolds/${selected}`)
    console.log(data)
    setPerformances(data)
    setLoading(false)
  }

  React.useEffect(() => {
    search()
  }, [selected])

  if (loading) return (<LoadingTab />)

  return (
    <>
      <br />
      { performances.length === 0 && (<NoDataWarning message="No performances for this booking." />)}
      { performances.map((perf) => (
        <PerformanceSection perf={perf} key={perf.Id} triggerSearch={search}/>
      ))}
    </>
  )
}
