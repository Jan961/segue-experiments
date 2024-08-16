import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, getCompanyContractsColumnDefs } from 'components/contracts/tableConfig';
import { useMemo, useRef } from 'react';
import { IContractSummary } from 'interfaces/contracts';
import { userState } from 'state/account/userState';
import { transformToOptions } from 'utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractListState } from 'state/contracts/contractsListState';

interface ContractsTableProps {
  rowData?: IContractSummary[];
}

export default function CompanyContractsTable({ rowData = [] }: ContractsTableProps) {
  const tableRef = useRef(null);
  const { users } = useRecoilValue(userState);
  const [contracts, setContracts] = useRecoilState(contractListState);
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

  const onCellValueChange = async (e) => {
    const contract = e.data;
    const updatedContract = {
      ...(contracts[contract.Id] || {}),
      ...(contract || {}),
    };
    setContracts({ ...contracts, [contract.Id]: updatedContract });
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={contractsStyleProps}
          ref={tableRef}
          onCellValueChange={onCellValueChange}
        />
      </div>
    </>
  );
}
