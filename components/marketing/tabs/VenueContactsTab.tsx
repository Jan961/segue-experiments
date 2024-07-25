import { useRecoilState, useRecoilValue } from 'recoil';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { venueRoleState } from 'state/marketing/venueRoleState';
import VenueContactForm from 'components/venues/modal/VenueContactsForm';
import { styleProps } from '../table/tableConfig';
import { UiVenueContact, mapVenueContactToPrisma } from 'utils/venue';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { VenueContactDTO } from 'interfaces';
import { Spinner } from 'components/global/Spinner';
import axios from 'axios';

interface VenueContactsProps {
  bookingId: string;
}

export interface VenueContactTabRef {
  resetData: () => void;
}

const VenueContactsTab = forwardRef<VenueContactTabRef, VenueContactsProps>((props, ref) => {
  const bookings = useRecoilValue(bookingJumpState);
  const [venueRoles, setVenueRoles] = useRecoilState(venueRoleState);
  const [venueContacts, setVenueContacts] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const venueStandardRoleList = [
    ...venueRoles.filter((vr) => vr.Standard === true).map((vr) => vr.Standard && { text: vr.Name, value: vr.Id }),
  ];

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const saveVenueContact = async (inputData, mode, updatedFormData) => {
    const data = { ...inputData, mode, updatedFormData };
    const booking = bookings.bookings.find((booking) => booking.Id === props.bookingId);
    const variant = data.mode;

    // create venue contact
    if (variant === 'create') {
      const newContact = data.venueContacts.find((contact) => contact.venueRoleId === null);
      const roleIndex = venueStandardRoleList.findIndex((role) => role.text === newContact.roleName);
      let venueRole = null;

      // create a new role if it doesn't exist in the standard list - the api also does this check
      if (roleIndex === -1) {
        const response = await axios.post('/api/venue/role/upsert', {
          name: newContact.roleName,
          isStandard: false,
        });

        venueRole = response.data;

        setVenueRoles([...venueRoles, venueRole]);
      }

      const newVc = {
        ...data,
        FirstName: newContact.firstName,
        LastName: newContact.lastName,
        Phone: newContact.phone,
        Email: newContact.email,
        VenueRoleId: venueRole ? venueRole.Id : null,
        VenueId: booking.VenueId,
      };

      const response = await axios.post('/api/marketing/venueContacts/create', newVc);
      const newVenueContact = response.data;

      if (typeof newVenueContact === 'object') {
        const newRole = newVenueContact as VenueContactDTO;
        const tempVenueContactUi: UiVenueContact = {
          ...newContact,
          venueId: parseInt(newVc.VenueId),
          roleName: newContact.roleName,
          venueRoleId: newVc.VenueRoleId,
          id: newRole.Id,
        };

        setVenueContacts([...venueContacts, tempVenueContactUi]);
      }

      // update fields
    } else if (variant === 'update') {
      const role = venueRoles.find((role) => role.Name === data.updatedFormData.roleName);
      if (!role || role.Id === undefined) {
        return;
      }

      const vcId = venueContacts.find((vc) => vc.venueRoleId === role.Id).id;
      const updatedRow = mapVenueContactToPrisma(data.updatedFormData);
      const dataToUpdate = { ...updatedRow, VenueId: booking.VenueId, Id: vcId, VenueRoleId: role.Id };

      await axios.post('/api/marketing/venueContacts/update', dataToUpdate);

      // delete venue contact
    } else if (variant === 'delete') {
      const updatedRow = mapVenueContactToPrisma(data.updatedFormData);
      await axios.post('/api/marketing/venueContacts/delete', updatedRow);
    }
  };

  const getVenueContacts = async (venueId: string) => {
    try {
      setVenueContacts([]);

      const response = await axios.get('/api/marketing/venueContacts/' + venueId);

      if (typeof response.data === 'object') {
        const venueContactList = response.data as Array<VenueContactDTO>;
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

        setVenueContacts(venueContactUiList);
        setDataAvailable(true);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.bookingId !== undefined && props.bookingId !== null) {
      const booking = bookings.bookings.find((booking) => booking.Id === props.bookingId);
      setSelectedVenue(booking.Venue);
      getVenueContacts(booking.VenueId.toString());
    }
  }, [props.bookingId]);

  if (dataAvailable) {
    if (isLoading) {
      return (
        <div className="mt-[150px] text-center">
          <Spinner size="lg" className="mr-3" />
        </div>
      );
    } else {
      return (
        <div>
          <VenueContactForm
            venueRoleOptionList={venueStandardRoleList}
            venue={selectedVenue}
            contactsList={venueContacts}
            onChange={(newData, mode, updatedRow) => saveVenueContact(newData, mode, updatedRow)}
            tableStyleProps={styleProps}
            tableHeight={585}
            title=""
            module="marketing"
          />
        </div>
      );
    }
  }
});

VenueContactsTab.displayName = 'VenueContactsTab';
export default VenueContactsTab;
