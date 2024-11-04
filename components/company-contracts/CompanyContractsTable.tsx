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
import { BuildNewContract, BuildNewContractProps } from './edit-contract-modal/BuildNewContract';
import { defaultContractSchedule } from './ContractSchedule';
import { productionJumpState } from 'state/booking/productionJumpState';
import { objectify } from 'radash';
import { CellClickedEvent } from 'ag-grid-community';
import { ContractPermissionGroup } from 'interfaces';

interface ContractsTableProps {
  rowData?: IContractSummary[];
  permissions: {
    accessContracts: ContractPermissionGroup;
    editRow: ContractPermissionGroup;
    savePDF: ContractPermissionGroup;
    changeStatus: ContractPermissionGroup;
    editPerson: ContractPermissionGroup;
  };
}
const defaultNotesPopupContext = { visible: false, contract: null };
const defaultEditContractState = {
  visible: false,
  contractId: null,
  personId: null,
  contractSchedule: defaultContractSchedule,
};

export default function CompanyContractsTable({
  rowData = [],
  permissions = {
    accessContracts: { artisteContracts: false, creativeContracts: false, smTechCrewContracts: false },
    editRow: { artisteContracts: false, creativeContracts: true, smTechCrewContracts: false },
    savePDF: { artisteContracts: false, creativeContracts: true, smTechCrewContracts: false },
    changeStatus: { artisteContracts: false, creativeContracts: true, smTechCrewContracts: false },
    editPerson: { artisteContracts: false, creativeContracts: true, smTechCrewContracts: false },
  },
}: ContractsTableProps) {
  const tableRef = useRef(null);
  const { users } = useRecoilValue(userState);
  const { productions } = useRecoilValue(productionJumpState);
  const productionMap = useMemo(() => objectify(productions, (production) => production.Id), [productions]);
  const [contracts, setContracts] = useRecoilState(contractListState);
  const [notesPopupContext, setNotesPopupContext] = useState(defaultNotesPopupContext);
  const [editContract, setEditContract] = useState<Partial<BuildNewContractProps>>(defaultEditContractState);
  const gridOptions = {
    getRowNodeId: (data) => {
      return data?.id;
    },
    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode?.data?.date;
      });
    },
    getPopupParent: () => document.body,
  };

  const userOptionList = useMemo(
    () =>
      transformToOptions(
        Object.values(users || {}),
        null,
        'AccUserId',
        ({ FirstName = '', LastName = '' }) => `${FirstName || ''} ${LastName || ''}`,
      ).sort((a, b) => a.text.localeCompare(b.text)),
    [users],
  );

  const columnDefs = useMemo(
    () =>
      getCompanyContractsColumnDefs(permissions.changeStatus, permissions.savePDF, permissions.editRow, userOptionList),
    [userOptionList],
  );
  const cancelToken = useAxiosCancelToken();

  const getProductionCode = (id: number) => {
    const production = productionMap[id];
    return `${production.ShowCode}${production.Code}`;
  };
  const getNotesPopupTitle = (contract: IContractSummary): string => {
    const { productionId, role, firstName, lastName } = contract || {};
    const code = productionId ? `${getProductionCode(productionId)} |` : '';
    const name = firstName || lastName ? `${firstName} ${lastName} |` : '';
    const roleName = role ? `${role}` : '';
    return `${code} ${name} ${roleName}`;
  };

  const handleCellClick = (e: CellClickedEvent) => {
    const colId = e.column.getColId();
    const data = e.data;
    const { departmentId, productionId, personId, role, id, templateId } = data;
    console.log(
      departmentId,
      permissions.savePDF.artisteContracts,
      permissions.savePDF.creativeContracts,
      permissions.savePDF.smTechCrewContracts,
    );
    if (colId === 'notes') {
      setNotesPopupContext({ visible: true, contract: data });
    }
    if (
      colId === 'edit' &&
      ((departmentId === 1 && permissions.editRow.artisteContracts) ||
        (departmentId === 2 && permissions.editRow.creativeContracts) ||
        (departmentId === 3 && permissions.editRow.smTechCrewContracts))
    ) {
      setEditContract({
        visible: true,
        contractId: id,
        contractSchedule: {
          role,
          production: productionId,
          department: departmentId,
          personId,
          templateId,
        },
      });
    }
    if (
      colId === 'pdf' &&
      ((departmentId === 1 && permissions.savePDF.artisteContracts) ||
        (departmentId === 2 && permissions.savePDF.creativeContracts) ||
        (departmentId === 3 && permissions.savePDF.smTechCrewContracts))
    ) {
      // Export PDF
      console.log('ExportPDF needs implementation');
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
        console.log(error);
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

  // Trim table data based on permissions
  const trimData = () => {
    const data = rowData.filter(
      (x) =>
        (x.departmentId === 1 && permissions.accessContracts.artisteContracts) ||
        (x.departmentId === 2 && permissions.accessContracts.creativeContracts) ||
        (x.departmentId === 3 && permissions.accessContracts.smTechCrewContracts),
    );
    return data;
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={trimData()}
          ref={tableRef}
          styleProps={contractsStyleProps}
          onCellValueChange={onCellValueChange}
          onCellClicked={handleCellClick}
          gridOptions={gridOptions}
        />
        {notesPopupContext.visible && (
          <NotesPopup
            show={notesPopupContext.visible}
            notes={notesPopupContext.contract?.notes || ''}
            title={getNotesPopupTitle(notesPopupContext.contract) || ''}
            onSave={handleSaveNote}
            onCancel={() => setNotesPopupContext(defaultNotesPopupContext)}
          />
        )}
        {editContract.visible && (
          <BuildNewContract
            {...editContract}
            visible={editContract?.visible}
            onClose={closeEditContractModal}
            isEdit
            editPerson={permissions.editPerson}
          />
        )}
      </div>
    </>
  );
}
