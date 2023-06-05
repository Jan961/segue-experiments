import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { StyledDialog } from 'components/global/StyledDialog'
import { Venue } from '@prisma/client'
import { title } from 'radash'

interface VenueInfoProps {
  venueId?: number
}

export const VenueInfoItem = ({ label, value }: { label: string, value: string}) => {
  return (
    <div className="flex">
      <label className="w-48 font-bold">{ title(label) }:&nbsp;</label>
      <span className="col-span-1">{ value }</span>
    </div>
  )
}

export const VenueInfo = ({ venueId }: VenueInfoProps) => {
  const [showModal, setShowModal] = React.useState(false)
  const [venue, setVenue] = React.useState<Venue>(undefined)

  useEffect(() => {
    if (showModal) {
      fetch(`/api/venue/${venueId}`)
        .then(res => res.json())
        .then(venueData => {
          setVenue(venueData)
        })
    }
  }, [venueId, showModal])

  return (
    <>
      <FormInputButton
        text="Venue Info"
        disabled={!venueId}
        className="w-full block"
        onClick={() => setShowModal(true)}
      />
      { showModal && (
        <StyledDialog title="Venue Information" width="lg" open={showModal} onClose={() => setShowModal(false)}>
          <>
            { venue && (Object.keys(venue).map((key) => (
              <VenueInfoItem key={key} label={key} value={venue[key]} />
            )))}
          </>
        </StyledDialog>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {

    }
  }
}
