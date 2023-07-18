export const NoDataWarning = ({ message }: { message?: string }) => (
  <div className="text-xl rounded text-center p-4 mb-4">
    { message || 'No data returned' }
  </div>)
