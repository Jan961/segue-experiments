export const ToolbarInfo = ({ value, label }: { value: string, label: string }) => {
  return (
    <button className="text-primary-blue self-center p-2 mr-4">
      <b>{label}</b>: { value}
    </button>
  )
}
