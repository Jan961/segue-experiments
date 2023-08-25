import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'components/global/table/Table'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { useRecoilValue } from 'recoil'
import React from 'react'
import axios from 'axios'
import { venueRoleState } from 'state/marketing/venueRoleState'
import { objectify } from 'radash'
import { VenueContactsEditor } from '../editors/VenueContactsEditor'
import { VenueContactDTO } from 'interfaces'
import { LoadingTab } from './LoadingTab'

export const VenueContactsTab = () => {
  const { selected, bookings } = useRecoilValue(bookingJumpState)
  const venueRoles = useRecoilValue(venueRoleState)
  const venueRoleDict = objectify(venueRoles, (x) => x.Id)
  const matching = bookings.filter(x => x.Id === selected)

  const venueId = matching[0]?.VenueId

  const [contacts, setContacts] = React.useState(undefined)
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(undefined)

  const search = async () => {
    setLoading(true)
    setContacts([])

    const { data } = await axios.get(`/api/marketing/venueContacts/${venueId}`)
    setContacts(data)
    setLoading(false)
  }

  const create = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const edit = (vc: VenueContactDTO) => {
    setEditing(vc)
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
        <FormInputButton text="Add New Contact" onClick={create} icon={faPlus}/>
        {modalOpen && <VenueContactsEditor open={modalOpen} triggerClose={triggerClose} venueId={venueId} venueContact={editing} />}
      </div>
      <Table className='table-auto !min-w-0'>
        <Table.HeaderRow>
          <Table.HeaderCell className='w-20'>
          Role
          </Table.HeaderCell>
          <Table.HeaderCell className='w-20'>
          First Name
          </Table.HeaderCell>
          <Table.HeaderCell className='w-20'>
          Last Name
          </Table.HeaderCell>
          <Table.HeaderCell className='w-20'>
          Phone
          </Table.HeaderCell>
          <Table.HeaderCell className='w-20'>
          Email
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {contacts.map((vc) => (
            <Table.Row key={vc.Id} onClick={() => edit(vc)} hover>
              <Table.Cell className='whitespace-nowrap'>
                {venueRoleDict[vc.RoleId].Name}
              </Table.Cell>
              <Table.Cell>
                {vc.FirstName}
              </Table.Cell>
              <Table.Cell>
                {vc.LastName}
              </Table.Cell>
              <Table.Cell className='whitespace-nowrap underline'>
                {vc.Phone ? (<a href={`tel://${vc.Phone}`}>{vc.Phone}</a>) : '' }
              </Table.Cell>
              <Table.Cell>
                <a className="underline" href={'mailto:' + vc.Email}>{vc.Email}</a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
