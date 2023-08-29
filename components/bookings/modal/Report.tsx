import { useRouter } from 'next/router'
import { ToolbarButton } from '../ToolbarButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { DescriptionList as DL } from 'components/global/DescriptionList'

export default function Report (TourId) {
  const [tourSummary, setTourSummary] = useState<any[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('Oops! Something went wrong. Please try again after some time')
  const router = useRouter()
  const fullTourCode = useMemo(() => `${router.query.ShowCode}${router.query.TourCode}`, [router.query])
  const fetchTourSummary = useCallback((tourCode) => {
    axios.get(`/api/tours/summary/${tourCode}`).then((response:any) => {
      if (response?.data?.ok) {
        setTourSummary(response.data.data)
      }
    }).catch(error => {
      console.log('====Error===', error)
    })
  }, [])
  useEffect(() => {
    if (fullTourCode)fetchTourSummary(fullTourCode)
  }, [fullTourCode])
  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)} submit>
      Tour Summary
      </ToolbarButton>
      {
        showModal
          ? <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10"
            >
              <div className="relative w-auto my-6 mx-auto max-w-6xl">
                {/* content */}
                <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/* header */}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                                        Tour Summary
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                      </span>
                    </button>
                  </div>
                  {/* body */}
                  <div className="py-4">
                    {
                      tourSummary.length
                        ? (<div className="grid grid-cols-1">
                          {
                            tourSummary.map((summaryItem, i) => (
                              <div key={i} className={`grid rounded px-2 gap-4 grid-cols-[70px_1fr_50px] ${i % 2 ? 'bg-table-row-alternating' : ''}`}>
                                <div>{fullTourCode}</div>
                                <div>{summaryItem.name}</div>
                                <div>{summaryItem.value}</div>
                              </div>
                            ))
                          }
                        </div>)
                        : <div className="text-primary-orange w-100 h-[100px] text-center">{error}</div>
                    }
                    {/* { tourSummary.length
                      ? <DL>
                        {
                          tourSummary.map((summaryItem, i) => (
                            <div key={i}>
                              <DL.Term>
                                {summaryItem.name}
                              </DL.Term>
                              <DL.Desc>
                                {summaryItem.value}
                              </DL.Desc>
                            </div>
                          ))
                        }
                      </DL>
                      : <div className="text-primary-orange w-100 h-[100px] text-center">{error}</div>
                    } */}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
          : <></>
      }
    </>
  )
}
