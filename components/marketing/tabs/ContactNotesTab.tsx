import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { BookingContactNoteDTO } from 'interfaces'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { Table } from 'components/global/table/Table'
import { LoadingTab } from './LoadingTab'
import { NoDataWarning } from '../NoDataWarning'
import { ContactNotesEditor } from '../editors/ContactNotesEditor'
import { dateToSimple } from 'services/dateService'

export const ContactNotesTab = () => {
  const { selected, bookings } = useRecoilValue(bookingJumpState)
  const [contactNotes, setContactNotes] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(undefined)

  const search = async () => {
    setLoading(true)
    setContactNotes([])

    const { data } = await axios.get(`/api/marketing/contactNotes/${selected}`)
    setContactNotes(data)
    setLoading(false)
  }

  const create = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const edit = (bcn: BookingContactNoteDTO) => {
    setEditing(bcn)
    setModalOpen(true)
  }

  React.useEffect(() => {
    search()
  }, [selected, bookings])

  const triggerClose = async (refresh: boolean) => {
    if (refresh) await search()
    setModalOpen(false)
  }

  if (loading) return (<LoadingTab />)

  return (
    <>
      <div className='text-right pb-4'>
        <FormInputButton text="Add New Note" onClick={create} icon={faPlus}/>
        {modalOpen && <ContactNotesEditor open={modalOpen} triggerClose={triggerClose} bookingId={selected} bookingContactNote={editing} />}

      </div>
      { contactNotes.length === 0 && (<NoDataWarning />)}
      { contactNotes.length > 0 && (

        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>
              Who
            </Table.HeaderCell>
            <Table.HeaderCell>
              Date
            </Table.HeaderCell>
            <Table.HeaderCell>
              Action By
            </Table.HeaderCell>
            <Table.HeaderCell className='w-3/4'>
              Notes
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {contactNotes.map((bcn: BookingContactNoteDTO) => (
              <Table.Row key={bcn.Id} hover onClick={() => edit(bcn)}>
                <Table.Cell>
                  {bcn.CoContactName}
                </Table.Cell>
                <Table.Cell>
                  {dateToSimple(bcn.ContactDate)}
                </Table.Cell>
                <Table.Cell>
                  {dateToSimple(bcn.ActionByDate)}
                </Table.Cell>
                <Table.Cell>
                  {bcn.Notes}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  )
}
