import { styleProps, venueContractDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { dummyVenueContractData } from 'config/Venue';

const VenueContactForm = () => {
  const getRowStyle = (params) => {
    if (params.node.rowIndex === 0) {
      // Change 'red' to your desired background color
      return { background: '#fad0cc' };
    }
    return null;
  };
  const onAddNewVenueContact = () => {
    console.log('Adding new venue is in Progress	');
  };
  return (
    <>
      <div className="flex flex-row items-center justify-between  pb-5">
        <h2 className="text-xl text-primary-navy font-bold ">Venue Contacts</h2>
        <Button onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
      </div>
      <Table
        columnDefs={venueContractDefs}
        rowData={dummyVenueContractData}
        styleProps={styleProps}
        getRowStyle={getRowStyle}
      />
    </>
  );
};

export default VenueContactForm;
