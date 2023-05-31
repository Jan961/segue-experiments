import * as React from 'react'
import { useEffect, useState } from 'react'
import { userService } from 'services/user.service'
import { forceNavigate } from 'utils/forceNavigate'

export default function TourJumpMenu () {
  const [isLoading, setLoading] = useState(false)
  const [activeTours, setActiveTours] = useState([]) // Shory list of tours for the toolbar to switch
  useEffect(() => {
    setLoading(true)

    /** Get the tours for the jump meniu */

    fetch('/api/tours/read/notArchived/0',
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          segue_admin: '1',
          account_admin: '1',
          user_id: '0',
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        setActiveTours(data)
        setLoading(false)
      })
  }, [])

  function changTour (e) {
    forceNavigate(`/booking/${e.target.value}`)
  }

  return (

    <select onChange={changTour} id="selectedTour" className={'text-primary-blue border-y-0 border-r-0 border-l-1 border-gray-200 font-medium rounded-r-md'}>
      {[].map((tour) => (
        <option key={tour.TourId} value={`${tour.Show.Code}/${tour.Code}`} >{tour.Show.Code}/{tour.Code}</option>
      ))
      }
    </select>

  )
}
