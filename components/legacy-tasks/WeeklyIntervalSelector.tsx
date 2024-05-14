interface WeeklyIntervalSelectorProps {
  onDayOfWeekChange: (dayIndex: number) => void;
}

function WeeklyIntervalSelector({ onDayOfWeekChange }: WeeklyIntervalSelectorProps) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDayOfWeekChange = (e) => {
    onDayOfWeekChange(e.target.value);
  };

  return (
    <div className="weekly-interval-selector">
      <label htmlFor="day-of-week" className="text-gray-700">
        Day of the Week:
      </label>
      <select
        id="day-of-week"
        onChange={handleDayOfWeekChange}
        className="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      >
        {daysOfWeek.map((day, index) => (
          <option key={index} value={index}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WeeklyIntervalSelector;
