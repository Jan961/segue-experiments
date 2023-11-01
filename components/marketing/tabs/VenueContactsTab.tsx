import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'components/global/table/Table';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { useRecoilValue } from 'recoil';
import React, { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { venueRoleState } from 'state/marketing/venueRoleState';
import { objectify } from 'radash';
import { VenueContactsEditor } from '../editors/VenueContactsEditor';
import { VenueContactDTO } from 'interfaces';
import { LoadingTab } from './LoadingTab';
import { FormInputText } from 'components/global/forms/FormInputText';
import { ToolbarButton } from 'components/bookings/ToolbarButton';

export const VenueContactsTab = () => {
  const { selected, bookings } = useRecoilValue(bookingJumpState);
  const venueRoles = useRecoilValue(venueRoleState);
  const venueRoleDict = objectify(venueRoles, (x) => x.Id);
  const matching = bookings.filter((x) => x.Id === selected);

  const venueId = matching[0]?.VenueId;

  const [contacts, setContacts] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(undefined);
  const [searchFilter, setSearchFilter] = useState('');
  const fuse = useRef(new Fuse(contacts, { keys: ['FirstName', 'LastName', 'Email', 'Phone'] }));
  const filteredContacts = useMemo(
    () => (searchFilter ? fuse.current.search(searchFilter).map((result) => result.item) : contacts),
    [contacts, searchFilter],
  );
  const search = async () => {
    setLoading(true);
    setContacts([]);

    const { data } = await axios.get(`/api/marketing/venueContacts/${venueId}`);
    setContacts(data);
    fuse.current = new Fuse(data, { keys: ['FirstName', 'LastName', 'Email', 'Phone'] });
    setLoading(false);
  };

  const create = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const edit = (vc: VenueContactDTO) => {
    setEditing(vc);
    setModalOpen(true);
  };

  React.useEffect(() => {
    search();
  }, [selected, bookings]);

  const triggerClose = async (refresh: boolean) => {
    if (refresh) await search();
    setModalOpen(false);
  };

  if (loading) return <LoadingTab />;

  return (
    <>
      <div className="flex justify-between items-center mt-5 mb-5 max-w-[820px]">
        <h2 className={'text-xl font-bold text-primary-blue '}>Venue Contacts</h2>
        <div className="ml-auto">
          <label htmlFor="searchBookings" className="sr-only">
            Search Contacts...
          </label>
          <div className="relative">
            <FormInputText
              name="Search"
              onChange={(e) => setSearchFilter(e.currentTarget.value)}
              value={searchFilter}
              placeholder="Search Contacts..."
              className="mb-0 w-[400px]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <Table className="table-auto !min-w-0">
        <Table.HeaderRow className="rounded-t-lg">
          <Table.HeaderCell className="w-20 rounded-tl-lg">Role</Table.HeaderCell>
          <Table.HeaderCell className="w-20">First Name</Table.HeaderCell>
          <Table.HeaderCell className="w-20">Last Name</Table.HeaderCell>
          <Table.HeaderCell className="w-20">Phone</Table.HeaderCell>
          <Table.HeaderCell className="w-20 rounded-tr-lg">Email</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {filteredContacts.map((vc) => (
            <Table.Row key={vc.Id} onClick={() => edit(vc)} hover>
              <Table.Cell className="whitespace-nowrap">{venueRoleDict[vc.RoleId].Name}</Table.Cell>
              <Table.Cell>{vc.FirstName}</Table.Cell>
              <Table.Cell>{vc.LastName}</Table.Cell>
              <Table.Cell className="whitespace-nowrap underline">
                {vc.Phone ? <a href={`tel://${vc.Phone}`}>{vc.Phone}</a> : ''}
              </Table.Cell>
              <Table.Cell>
                <a className="underline" href={'mailto:' + vc.Email}>
                  {vc.Email}
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="text-left pt-4 max-w-[820px]">
        <ToolbarButton onClick={create} className="!text-primary-green">
          Add another contact
        </ToolbarButton>
        {modalOpen && (
          <VenueContactsEditor open={modalOpen} triggerClose={triggerClose} venueId={venueId} venueContact={editing} />
        )}
      </div>
    </>
  );
};
