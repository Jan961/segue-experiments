import { styleProps, venueContactDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import Table from 'components/core-ui-lib/Table';
import { useCallback, useState, useEffect } from 'react';
import { UiTransformedVenue, UiVenueContact, filterEmptyVenueContacts } from 'utils/venue';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';

interface VenueContactDetailsFormProps {
  venue: Partial<UiTransformedVenue>;
  contactsList?: UiVenueContact[];
  onChange: (data: any) => void;
  venueRoleOptionList: SelectOption[];
}

const VenueContactForm = ({
  onChange,
  venue,
  venueRoleOptionList,
  contactsList = [],
}: VenueContactDetailsFormProps) => {
  const [venueContacts, setVenueContacts] = useState<UiVenueContact[]>(contactsList);
  const confVariant = 'delete';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [createMode, setCreateMode] = useState(false);

  const getRowStyle = useCallback(
    (params) => {
      if (params.node.rowIndex === 0 && createMode) {
        return { background: '#fad0cc' };
      }
      return null;
    },
    [createMode],
  );

  useEffect(() => {
    const defaultContact = {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    };

    const existingVenueRoleIds = new Set(contactsList.map((contact) => contact.venueRoleId));

    const missingVenueRoles = venueRoleOptionList.filter(
      (role) => !existingVenueRoleIds.has(parseInt(role.value as string, 10)),
    );
    const newContacts = missingVenueRoles.map((role) => ({
      ...defaultContact,
      venueRoleId: parseInt(role.value as string, 10),
      roleName: role.text,
    }));

    const updatedContacts = [...newContacts, ...contactsList];

    setVenueContacts(updatedContacts);
  }, []);

  const onAddNewVenueContact = () => {
    if (createMode) return;
    const emptyData = { venueRoleId: null, firstName: '', lastName: '', phone: '', email: '' };
    setVenueContacts((prev) => [emptyData, ...prev]);
    setCreateMode(true);
  };

  const handleCellValueChange = (e) => {
    const { column, value, rowIndex } = e;
    const updatedContacts = [...venueContacts];
    updatedContacts[rowIndex][column.colId] = value;
    setVenueContacts(updatedContacts);
    const updatedFormData = {
      ...venue,
      venueContacts: filterEmptyVenueContacts(updatedContacts),
    };
    onChange(updatedFormData);
    if (createMode) {
      const { roleName, firstName, lastName, phone, email } = updatedContacts[0];
      if (roleName || firstName || lastName || phone || email) {
        setCreateMode(false);
      }
    }
  };

  const onCellClicked = (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      setShowDeleteModal(!showDeleteModal);
      setDeleteIndex(rowIndex);
    }
  };

  const deleteRow = () => {
    const updatedContactVenueTableRows = [
      ...venueContacts.slice(0, deleteIndex),
      ...venueContacts.slice(deleteIndex + 1),
    ];
    setVenueContacts(updatedContactVenueTableRows);
    setDeleteIndex(null);
    setShowDeleteModal(!showDeleteModal);
    const updatedFormData = {
      ...venue,
      venueContacts: updatedContactVenueTableRows,
    };
    onChange(updatedFormData);
    if (createMode && deleteIndex === 0) {
      setCreateMode(false);
    }
  };
  return (
    <div className="block mb-4">
      <div className="flex flex-row items-center justify-between  pb-5">
        <h2 className="text-xl text-primary-navy font-bold ">Venue Contacts</h2>
        <Button disabled={createMode} onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
      </div>
      <div className="min-h-52">
        <Table
          columnDefs={venueContactDefs(venueRoleOptionList)}
          rowData={venueContacts}
          styleProps={styleProps}
          getRowStyle={getRowStyle}
          onCellClicked={onCellClicked}
          onCellValueChange={handleCellValueChange}
        />
      </div>

      <ConfirmationDialog
        variant={confVariant}
        show={showDeleteModal}
        onYesClick={() => deleteRow()}
        onNoClick={() => {
          setShowDeleteModal(!showDeleteModal);
          setDeleteIndex(null);
        }}
        hasOverlay={false}
      />
    </div>
  );
};

export default VenueContactForm;
