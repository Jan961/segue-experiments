import { useRouter } from 'next/router'
import { ToolbarButton } from '../ToolbarButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
// import { DescriptionList as DL } from 'components/global/DescriptionList'
import { StyledDialog } from 'components/global/StyledDialog'
import { Spinner } from 'components/global/Spinner'

export default function Report ({ TourId }:{TourId:number}) {
  const [tourSummary, setTourSummary] = useState<any[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('Oops! Something went wrong. Please try again after some time')
  const router = useRouter()
  const fullTourCode = useMemo(() => `${router.query.ShowCode}${router.query.TourCode}`, [router.query])
  const fetchTourSummary = useCallback((tourCode) => {
    setIsLoading(true)
    axios.get(`/api/tours/summary/${tourCode}`).then((response:any) => {
      if (response?.data?.ok) {
        setTourSummary(response.data.data)
      }
    }).catch(error => {
      console.log('Error:', error)
    }).finally(() => setIsLoading(false))
  }, [])
  useEffect(() => {
    if (TourId)fetchTourSummary(TourId)
  }, [TourId])
  return (
    <>
      <ToolbarButton
        onClick={() => setShowModal(true)}
        submit
      >
        Tour Summary
      </ToolbarButton>
      <StyledDialog className='w-1/4 max-w-full max-h-[95vh] relative' open={showModal} onClose={() => setShowModal(false)} title="Tour Summary" width='xl'>
        {loading && <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95"><Spinner className="w-full" size='lg'/></div>}
        <div className="py-4 overflow-y-auto max-h-[80vh]">
          {
            tourSummary.length
              ? (<div className="grid grid-cols-1">
                {
                  tourSummary.map((summaryGroup, i) => (
                    <div key={i}>
                      {
                        summaryGroup.map((summaryItem, j) => (
                          <div key={j} className={'grid rounded px-2 py-2 gap-4 grid-cols-[1fr_50px] bg-table-row-alternating'}>
                            <div>{summaryItem.name}</div>
                            <div>{summaryItem.value}</div>
                          </div>
                        ))
                      }
                      <div className={'w-full h-[25px] white'}></div>
                    </div>
                  ))
                }
              </div>)
              : <div className="text-primary-orange w-100 h-[100px] text-center">{error}</div>
          }
        </div>
      </StyledDialog>
    </>
  )
}
