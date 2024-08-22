import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, getCompanyContractsColumnDefs } from 'components/contracts/tableConfig';
import { useCallback, useMemo, useRef, useState } from 'react';
import { IContractSummary } from 'interfaces/contracts';
import { userState } from 'state/account/userState';
import { transformToOptions } from 'utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractListState } from 'state/contracts/contractsListState';
import NotesPopup from 'components/NotesPopup';
import { notify } from 'components/core-ui-lib';
import useAxiosCancelToken from 'hooks/useCancelToken';
import axios from 'axios';
import { BuildNewContract, BuildNewContractProps } from '../modal/BuildNewContract';
import { defaultContractSchedule } from '../modal/ContractSchedule';

interface ContractsTableProps {
  rowData?: IContractSummary[];
}
const defaultNotesPopupContext = { visible: false, contract: null };
const defaultEditContractState = {
  visible: false,
  contractId: null,
  personId: null,
  contractSchedule: defaultContractSchedule,
};

export default function CompanyContractsTable({ rowData = [] }: ContractsTableProps) {
  const tableRef = useRef(null);
  const { users } = useRecoilValue(userState);
  const [contracts, setContracts] = useRecoilState(contractListState);
  const [notesPopupContext, setNotesPopupContext] = useState(defaultNotesPopupContext);
  const [editContract, setEditContract] = useState<Partial<BuildNewContractProps>>(defaultEditContractState);

  const userOptionList = useMemo(
    () =>
      transformToOptions(
        Object.values(users),
        null,
        'Id',
        ({ FirstName = '', LastName = '' }) => `${FirstName} ${LastName}`,
      ),
    [users],
  );
  const columnDefs = useMemo(() => getCompanyContractsColumnDefs(userOptionList), [userOptionList]);
  const cancelToken = useAxiosCancelToken();

  const handleCellClick = (e) => {
    if (e.column.colId === 'notes') {
      setNotesPopupContext({ visible: true, contract: e.data });
    }
    if (e.column.colId === 'edit') {
      const { departmentId, productionId, personId, role, id } = e.data;
      setEditContract({
        visible: true,
        contractId: id,
        contractSchedule: {
          role,
          production: productionId,
          department: departmentId,
          personId,
          templateId: 1,
        },
      });
    }
  };

  const onCellValueChange = async (e) => {
    const contract = e.data;
    updateContract(contract.id, contract);
  };

  const updateContract = useCallback(
    async (id: number, contract: Partial<IContractSummary>, callback?: () => void) => {
      try {
        await axios.post(`/api/company-contracts/update/${id}`, contract, { cancelToken });
        setContracts({ ...contracts, [id]: { ...contracts[id], ...contract } });
        callback?.();
      } catch (error) {
        notify.error('Error updating contract');
      }
    },
    [cancelToken, setContracts, contracts],
  );

  const handleSaveNote = useCallback(
    (notes: string) => {
      const contract = notesPopupContext.contract;
      updateContract(contract.id, { notes }, () => setNotesPopupContext(defaultNotesPopupContext));
    },
    [updateContract, notesPopupContext],
  );

  const closeEditContractModal = useCallback(() => {
    setEditContract(defaultEditContractState);
  }, []);

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          ref={tableRef}
          styleProps={contractsStyleProps}
          onCellValueChange={onCellValueChange}
          onCellClicked={handleCellClick}
        />
        {notesPopupContext.visible && (
          <NotesPopup
            show={notesPopupContext.visible}
            notes={notesPopupContext.contract?.notes || ''}
            title={`${notesPopupContext.contract?.firstName || ''} | ${notesPopupContext.contract?.lastName || ''} | ${
              notesPopupContext?.contract.role || ''
            }`}
            onSave={handleSaveNote}
            onCancel={() => setNotesPopupContext(defaultNotesPopupContext)}
          />
        )}
        {editContract.visible && (
          <BuildNewContract {...editContract} visible={editContract?.visible} onClose={closeEditContractModal} isEdit />
        )}
      </div>
    </>
  );
}
