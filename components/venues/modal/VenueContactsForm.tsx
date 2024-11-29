import { styleProps, venueContactDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import Table from 'components/core-ui-lib/Table';
import { useCallback, useState, useEffect } from 'react';
import { UiTransformedVenue, UiVenueContact, filterEmptyVenueContacts } from 'utils/venue';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { StyleProps } from 'components/core-ui-lib/Table/Table';

interface VenueContactDetailsFormProps {
  venue: Partial<UiTransformedVenue>;
  contactsList?: UiVenueContact[];
  onChange: (data: any, mode?: string, updatedRow?: any) => void;
  venueRoleOptionList: SelectOption[];
  tableStyleProps?: StyleProps;
  tableHeight?: number;
  title?: string;
  module?: string;
  disabled?: boolean;
}

const gridOptions = {
  getRowNodeId: (data) => {
    return data.roleName;
  },
  onRowDataUpdated: (params) => {
    params.api.forEachNode((rowNode) => {
      rowNode.id = rowNode.data.roleName;
    });
  },
};

const VenueContactForm = ({
  onChange,
  venue,
  venueRoleOptionList,
  contactsList = [],
  tableStyleProps = styleProps,
  tableHeight = 0, // 0 uses default sizing
  title = 'Venue Contacts',
  module = 'bookings',
  disabled,
}: VenueContactDetailsFormProps) => {
  const [venueContacts, setVenueContacts] = useState<UiVenueContact[]>(contactsList);
  const confVariant = 'delete';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [createMode, setCreateMode] = useState(false);

  const getRowStyle = useCallback(
    (params) => {
      if (params.node.rowIndex === 0 && createMode) {
        return { background: module === 'bookings' ? '#fad0cc' : '#c1e0db' };
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
    updatedContacts.sort((a, b) => a.roleName.localeCompare(b.roleName));
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
      venueContacts: filterEmptyVenueContacts(updatedContacts, venueRoleOptionList),
    };

    if (createMode) {
      onChange(updatedFormData, 'create');
      const { roleName, firstName, lastName, phone, email } = updatedContacts[0];
      if (roleName || firstName || lastName || phone || email) {
        setCreateMode(false);
      }
    } else {
      onChange(updatedFormData, 'update', e.data);
    }
  };

  const onCellClicked = (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete' && !disabled) {
      setShowDeleteModal(!showDeleteModal);
      setDeleteIndex(rowIndex);
    }
  };

  const deleteRow = () => {
    const rowToDel = venueContacts[deleteIndex];
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
    onChange(updatedFormData, 'delete', rowToDel);
    if (createMode && deleteIndex === 0) {
      setCreateMode(false);
    }
  };

  return (
    <div className="block mb-4">
      <div className="flex flex-row items-center justify-between  pb-5">
        <h2 className="text-xl text-primary-navy font-bold ">{title}</h2>
        <Button
          disabled={createMode || disabled}
          onClick={onAddNewVenueContact}
          variant="primary"
          testId="add-new-contract-btn"
          text="Add New Contact"
        />
      </div>
      <div className="min-h-52">
        <Table
          testId="venue-contacts-table"
          columnDefs={venueContactDefs(venueRoleOptionList, disabled)}
          rowData={venueContacts}
          styleProps={tableStyleProps}
          getRowStyle={getRowStyle}
          onCellClicked={onCellClicked}
          onCellValueChange={handleCellValueChange}
          tableHeight={tableHeight}
          gridOptions={gridOptions}
        />
        {showDeleteModal && (
          <ConfirmationDialog
            variant={confVariant}
            show={showDeleteModal}
            onYesClick={deleteRow}
            onNoClick={() => {
              setShowDeleteModal(false);
              setDeleteIndex(null);
            }}
            hasOverlay={false}
          />
        )}
      </div>
    </div>
  );
};

export default VenueContactForm;
