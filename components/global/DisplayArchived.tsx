interface DisplayArchivedProps {
  onChange: (e: any) => void;
  checked: boolean;
}

export const DisplayArchived = ({ onChange, checked }: DisplayArchivedProps) => {
  return (
    <div className="mr-4 inline-block">
      <label htmlFor="display-archive" className="text-xs whitespace-nowrap">
        <input
          type="checkbox"
          id="display-archive"
          name="display-archive"
          className="mr-2"
          onChange={onChange}
          checked={checked}
        />
      Display archived shows
      </label>
    </div>
  )
}
