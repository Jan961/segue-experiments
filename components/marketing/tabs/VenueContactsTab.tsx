import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'components/global/table/Table'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { useRecoilValue } from 'recoil'
import React from 'react'
import axios from 'axios'
import { Spinner } from 'components/global/Spinner'
import { venueRoleState } from 'state/marketing/venueRoleState'
import { objectify } from 'radash'
import { VenueContactsEditor } from '../editors/VenueContactsEditor'
import { VenueContactDTO } from 'interfaces'

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
    console.log(vc)
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

  if (loading) return (<Spinner size='lg' className="mt-8" />)

  return (
    <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className='text-right pb-4'>
        <FormInputButton text="Add New Contact" onClick={create} icon={faPlus}/>
        {modalOpen && <VenueContactsEditor open={modalOpen} triggerClose={triggerClose} venueId={venueId} venueContact={editing} />}
      </div>
      <Table>
        <Table.HeaderRow>
          <Table.HeaderCell>
          Role
          </Table.HeaderCell>
          <Table.HeaderCell>
          First Name
          </Table.HeaderCell>
          <Table.HeaderCell>
          Last Name
          </Table.HeaderCell>
          <Table.HeaderCell>
          Phone
          </Table.HeaderCell>
          <Table.HeaderCell>
          Email
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {contacts.map((vc) => (
            <Table.Row key={vc.Id} onClick={() => edit(vc)} hover>
              <Table.Cell>
                {venueRoleDict[vc.RoleId].Name}
              </Table.Cell>
              <Table.Cell>
                {vc.FirstName}
              </Table.Cell>
              <Table.Cell>
                {vc.LastName}
              </Table.Cell>
              <Table.Cell>
                {vc.Phone}
              </Table.Cell>
              <Table.Cell>
                <a className="underline" href={'mailto:' + vc.Email}>{vc.Email}</a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
