import { useRecoilState, useRecoilValue } from 'recoil';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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

export interface VenueContactTabRef {
  resetData: () => void;
}

const VenueContactsTab = forwardRef<VenueContactTabRef, VenueContactsProps>((props, ref) => {
  const bookings = useRecoilState(bookingJumpState);
  const venueRoles = useRecoilValue(venueRoleState);
  const [venueContactsTable, setVenueContactsTable] = useState(<div />);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const venueStandardRoleList = [
    ...venueRoles.filter((vr) => vr.Standard === true).map((vr) => vr.Standard && { text: vr.Name, value: vr.Id }),
  ];

  const { fetchData } = useAxios();

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const saveVenueContact = async (data) => {
    const booking = bookings[0].bookings.find((booking) => booking.Id === props.bookingId);
    const variant = data.mode;

    // create venue contact
    if (variant === 'create') {
      const newContact = data.updatedFormData.venueContacts.find((contact) => contact.venueRoleId === null);
      const roleIndex = venueStandardRoleList.findIndex((role) => role.text === newContact.roleName);
      let venueRole = null;

      // create a new role if it doesn't exist in the standard list - the api also does this check
      if (roleIndex === -1) {
        venueRole = await fetchData({
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
        FirstName: newContact.firstName,
        LastName: newContact.lastName,
        Phone: newContact.phone,
        Email: newContact.email,
        VenueRoleId: venueRole.Id,
        VenueId: booking.VenueId,
      };

      await fetchData({
        url: '/api/marketing/venueContacts/create',
        method: 'POST',
        data: newVc,
      });

      getVenueContacts(booking.VenueId.toString());

      // update fields
    } else if (variant === 'update') {
      const updatedRow = mapVenueContactToPrisma(data.updatedRow);
      const dataToUpdate = { ...updatedRow, VenueId: booking.VenueId };

      await fetchData({
        url: '/api/marketing/venueContacts/update',
        method: 'POST',
        data: dataToUpdate,
      });

      // delete venue contact
    } else if (variant === 'delete') {
      const updatedRow = mapVenueContactToPrisma(data.rowToDel);
      await fetchData({
        url: '/api/marketing/venueContacts/delete',
        method: 'POST',
        data: updatedRow,
      });
    }
  };

  const getVenueContacts = async (venueId: string) => {
    try {
      setVenueContactsTable(<div />);

      const data = await fetchData({
        url: '/api/marketing/venueContacts/' + venueId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const venueContactList = data as Array<VenueContactDTO>;
        const venueContactUiList: Array<UiVenueContact> = [];

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

        setVenueContactsTable(
          <VenueContactForm
            venueRoleOptionList={venueStandardRoleList}
            venue={selectedVenue}
            contactsList={venueContactUiList}
            onChange={(newData) => saveVenueContact(newData)}
            tableStyleProps={styleProps}
            tableHeight={585}
            title=""
            module="marketing"
          />,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.bookingId !== undefined && props.bookingId !== null) {
      const booking = bookings[0].bookings.find((booking) => booking.Id === props.bookingId);
      setSelectedVenue(booking.Venue);
      getVenueContacts(booking.VenueId.toString());
      setDataAvailable(true);
    }
  }, [props.bookingId]);

  return <div>{dataAvailable && <div>{venueContactsTable}</div>}</div>;
});

VenueContactsTab.displayName = 'VenueContactsTab';
export default VenueContactsTab;
