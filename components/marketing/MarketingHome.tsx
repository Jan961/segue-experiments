import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Summary } from './Summary';
import Icon from 'components/core-ui-lib/Icon';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import useAxios from 'hooks/useAxios';
import Button from 'components/core-ui-lib/Button';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { tabState } from 'state/marketing/tabState';
import { contactNoteColDefs, styleProps } from 'components/marketing/table/tableConfig';
import Table from 'components/core-ui-lib/Table';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import ContactNoteModal, { ContactNoteModalVariant } from './modal/ContactNoteModal';
import SalesTab from './tabs/SalesTab';
import ActivitiesTab from './tabs/ActivitiesTab';
import { BookingContactNoteDTO } from 'interfaces';
import { ArchivedSalesTab } from './tabs/ArchivedSalesTab';

export type SelectOption = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type DataList = {
  townList: Array<SelectOption>;
  venueList: Array<SelectOption>;
};

export type VenueDetail = {
  name: string;
  code: string;
  town: string;
};

const MarketingHome = () => {
  // global module variables
  const { selected: productionId } = useRecoilValue(productionJumpState);
  // global module variables
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [tabSet, setTabSet] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useRecoilState(tabState);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [showContactNoteModal, setShowContactNoteModal] = useState<boolean>(false);
  const [contactModalVariant, setContactModalVariant] = useState<ContactNoteModalVariant>();
  const [contactNoteRows, setContactNoteRows] = useState<Array<BookingContactNoteDTO>>();
  const [contNoteColDefs, setContNoteColDefs] = useState([]);
  const [contactNoteRow, setContactNoteRow] = useState<BookingContactNoteDTO>();

  const router = useRouter();

  const tabs = [
    'Sales',
    'Archived Sales',
    'Activities',
    'Contact Notes',
    'Venue Contacts',
    'Promoter Holds',
    'Attachments',
  ];

  const { fetchData } = useAxios();

  const getContactNotes = async (bookingId: string) => {
    const data = await fetchData({
      url: '/api/marketing/contactNotes/' + bookingId,
      method: 'POST',
    });

    if (typeof data === 'object') {
      const contactNoteList = data as Array<BookingContactNoteDTO>;

      const sortedContactNotes = contactNoteList.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContNoteColDefs(contactNoteColDefs(contactNoteUpdate));
      setContactNoteRows(sortedContactNotes);
    }
  };

  const contactNoteUpdate = (variant: ContactNoteModalVariant, data: BookingContactNoteDTO) => {
    setContactModalVariant(variant);
    setContactNoteRow(data);

    if (variant === 'edit') {
      setShowContactNoteModal(true);
    } else if (variant === 'delete') {
      setShowConfirm(true);
    }
  };

  const saveContactNote = async (variant: ContactNoteModalVariant, data) => {
    if (variant === 'add') {
      await fetchData({
        url: '/api/marketing/contactNotes/create',
        data,
        method: 'POST',
      });

      const conNoteData = [...contactNoteRows, data];

      // re sort the rows to ensure the new field is put in the correct place chronologically
      const sortedContactNotes = conNoteData.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'edit') {
      await fetchData({
        url: '/api/marketing/contactNotes/update',
        method: 'POST',
        data,
      });

      const rowIndex = contactNoteRows.findIndex((conNote) => conNote.Id === data.Id);
      const newRows = [...contactNoteRows];
      newRows[rowIndex] = data;

      const sortedContactNotes = newRows.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'delete') {
      await fetchData({
        url: '/api/marketing/contactNotes/delete',
        method: 'POST',
        data,
      });

      const rowIndex = contactNoteRows.findIndex((conNote) => conNote.Id === data.Id);
      const newRows = [...contactNoteRows];
      if (rowIndex !== -1) {
        newRows.splice(rowIndex, 1);
      }

      setContactNoteRows(newRows);
      setShowConfirm(false);
    }
  };

  const addContactNote = () => {
    setContactModalVariant('add');
    setShowContactNoteModal(true);
  };

  useEffect(() => {
    if (bookings[0].selected !== bookingId) {
      setBookingId(bookings[0].selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings[0].selected]);

  useEffect(() => {
    if (bookingId !== undefined && bookingId !== null) {
      getContactNotes(bookingId.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // using tabSet to ensure this is only run once
  // when a production is selected this code was re-run as a result the tabIndex was set to 0
  if (!tabSet) {
    const currentTab = router.query.tabIndex;
    if (currentTab !== undefined) {
      const tabIStr = currentTab.toString();
      setTabIndex(parseInt(tabIStr));
      setTabSet(true);
    }
  }

  return (
    <div className="flex w-full h-full">
      {/* Green Box */}
      <div className="bg-primary-green/[0.15] w-[291px] h-[690PX] rounded-xl p-4 mr-5 flex flex-col justify-between mb-5 -mt-5">
        <div className="flex-grow overflow-y-auto">
          <Summary />
        </div>
        <div className="flex flex-col border-y-2 border-t-primary-input-text border-b-0 py-4 -mb-3.5">
          <div className="flex items-center text-primary-navy">
            <Icon iconName={'user-solid'} variant="sm" />
            <div className="ml-4 bg-secondary-green text-primary-white px-1">Down to single seats</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'book-solid'} variant="sm" />
            <div className="ml-4 bg-secondary-yellow text-primary-navy px-1">Brochure released</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'square-cross'} variant="sm" />
            <div className="ml-4 bg-secondary-red text-primary-white px-1">Not on sale</div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <Tabs
          selectedTabClass="!bg-primary-green/[0.30] !text-primary-navy"
          tabs={tabs}
          disabled={!productionId || !bookingId}
          defaultIndex={tabIndex}
        >
          <Tab.Panel className="h-[650px] overflow-y-hidden">
            <SalesTab bookingId={bookingId} />
          </Tab.Panel>

          <Tab.Panel>
            <ArchivedSalesTab />
          </Tab.Panel>

          <Tab.Panel className="h-[650px]">
            <ActivitiesTab bookingId={bookingId} />
          </Tab.Panel>

          <Tab.Panel>
            <div className="flex justify-end">
              <div className="flex flex-row gap-4 w-[850px] mb-5">
                <Button
                  text="Contact Notes Report"
                  className="w-[203px]"
                  disabled={!productionId}
                  iconProps={{ className: 'h-4 w-3' }}
                  sufixIconName={'excel'}
                />
                <Button text="Add New" className="w-[160px]" onClick={addContactNote} />
              </div>
            </div>

            <div className="flex flex-row">
              <div className="w-[1086px] h-[500px]">
                <Table columnDefs={contNoteColDefs} rowData={contactNoteRows} styleProps={styleProps} />
              </div>
            </div>

            <ContactNoteModal
              show={showContactNoteModal}
              onCancel={() => setShowContactNoteModal(false)}
              variant={contactModalVariant}
              data={contactNoteRow}
              onSave={(variant, data) => saveContactNote(variant, data)}
              bookingId={bookingId}
            />
          </Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">venue contacts</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">promoter holds</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">attachments</Tab.Panel>
        </Tabs>
      </div>
      <ConfirmationDialog
        variant={'delete'}
        show={showConfirm}
        onYesClick={() => saveContactNote('delete', contactNoteRow)}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
};

export default MarketingHome;
