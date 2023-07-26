export const HardCodedWarning = ({ message }: { message?: string }) => (
  <div className="text-xl rounded text-center bg-red-200 text-red-800 p-4 mb-4">
    { message || 'This Content is Hard-coded' }
  </div>)
