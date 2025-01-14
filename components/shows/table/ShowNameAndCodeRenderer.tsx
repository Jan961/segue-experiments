const ShowNameAndCodeRenderer = (params) => {
  const rowData = params.data;
  return (
    <div className="flex justify-between">
      <p>{rowData.ShowName}</p>
      <p>{rowData.ShowCode + (rowData.Code || '')}</p>
    </div>
  );
};

export default ShowNameAndCodeRenderer;
