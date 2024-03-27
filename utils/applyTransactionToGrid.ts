const applyTransactionToGrid = (tableRef, transactionObject) => {
  if (!tableRef || !tableRef.current || !tableRef.current.getApi) {
    console.error('Invalid tableRef provided');
    return;
  }

  const gridApi = tableRef.current.getApi();
  gridApi.applyTransaction(transactionObject);
};

export default applyTransactionToGrid;
