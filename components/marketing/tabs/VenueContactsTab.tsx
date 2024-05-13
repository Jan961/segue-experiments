import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { venueRoleState } from 'state/marketing/venueRoleState';
import VenueContactForm from 'components/venues/modal/VenueContactsForm';
import { styleProps } from '../table/tableConfig';
import { UiVenueContact, mapVenueContactToPrisma } from 'utils/venue';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import useAxios from 'hooks/useAxios';
import { VenueContactDTO } from 'interfaces';

interface VenueContactsProps {
  bookingId: string;
}

export default function VenueContactsTab({ bookingId }: VenueContactsProps) {
  const { fetchData } = useAxios();

  const bookings = useRecoilState(bookingJumpState);
  const venueRoles = useRecoilValue(venueRoleState);
  const [venueContactRows, setVenueContactRows] = useState<Array<UiVenueContact>>();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const venueStandardRoleList = [
    ...venueRoles.filter((vr) => vr.Standard === true).map((vr) => vr.Standard && { text: vr.Name, value: vr.Id }),
  ];
  const [contactsAvail, setContactsAvail] = useState(false);

  const placeholder: UiVenueContact = {
    email: 'Enter Email Address',
    firstName: 'Enter First Name',
    lastName: 'Enter Last Name',
    phone: 'Enter Phone No.',
    roleName: 'Enter Job Title',
  };

  const saveVenueContact = async (data) => {
    const booking = bookings[0].bookings.find((booking) => booking.Id === bookingId);
    const variant = data.mode;

    if (variant === 'create') {
      const newContact = data.updatedFormData.venueContacts.find((contact) => contact.venueRoleId === null);
      const roleIndex = venueStandardRoleList.findIndex((role) => role.text === newContact.roleName);
      let roleId = null;

      if (roleIndex === -1) {
        roleId = await fetchData({
          url: '/api/venue/role/upsert',
          method: 'POST',
          data: {
            name: newContact.roleName,
            isStandard: false,
          },
        });
      }

      const newVc = {
        ...data,
        FirstName: newContact.firstName === placeholder.firstName ? null : newContact.firstName,
        LastName: newContact.lastName === placeholder.lastName ? null : newContact.lastName,
        Phone: newContact.phone === placeholder.phone ? null : newContact.phone,
        Email: newContact.email === placeholder.email ? null : newContact.email,
        RoleId: roleId,
        VenueId: booking.VenueId,
      };

      await fetchData({
        url: '/api/marketing/venueContacts/create',
        method: 'POST',
        data: newVc,
      });
    } else if (variant === 'update') {
      const updatedRow = mapVenueContactToPrisma(data.updatedRow);
      console.log(updatedRow);
      await fetchData({
        url: '/api/marketing/venueContacts/update',
        method: 'POST',
        data: updatedRow,
      });
    } else if (variant === 'delete') {
      const updatedRow = mapVenueContactToPrisma(data.rowToDel);
      alert(JSON.stringify(updatedRow));
      await fetchData({
        url: '/api/marketing/venueContacts/delete',
        method: 'POST',
        data: updatedRow,
      });
    }
  };

  const getVenueContacts = async (venueId: string) => {
    try {
      setVenueContactRows([]);

      const data = await fetchData({
        url: '/api/marketing/venueContacts/' + venueId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const venueContactList = data as Array<VenueContactDTO>;
        const venueContactUiList: Array<UiVenueContact> = [placeholder];

        venueContactList.forEach((vc) => {
          const role = venueRoles.find((v) => v.Id === vc.VenueRoleId);
          const tempVenueContactUi: UiVenueContact = {
            email: vc.Email,
            firstName: vc.FirstName,
            lastName: vc.LastName,
            phone: vc.Phone,
            venueId: parseInt(venueId),
            roleName: role.Name,
            venueRoleId: role.Id,
            id: vc.Id,
          };
          venueContactUiList.push(tempVenueContactUi);
        });

        setVenueContactRows(venueContactUiList);
        setContactsAvail(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const booking = bookings[0].bookings.find((booking) => booking.Id === bookingId);
    setSelectedVenue(booking.Venue);
    getVenueContacts(booking.VenueId.toString());
  }, [bookingId]);

  return (
    <>
      {contactsAvail && (
        <VenueContactForm
          venueRoleOptionList={venueStandardRoleList}
          venue={selectedVenue}
          contactsList={venueContactRows}
          onChange={(newData) => saveVenueContact(newData)}
          tableStyleProps={styleProps}
          tableHeight={585}
          title={''}
          module="marketing"
        />
      )}
    </>
  );
}
