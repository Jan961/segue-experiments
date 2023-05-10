import React from 'react';

function MonthlyIntervalSelector({ onDayOfMonthChange }) {
  const handleDayOfMonthChange = (e) => {
    onDayOfMonthChange(e.target.value);
  };

  return (
    <div className="monthly-interval-selector">
      <label htmlFor="day-of-month" className="text-gray-700">
        Day of the Month:
      </label>
      <select
        id="day-of-month"
        onChange={handleDayOfMonthChange}
        className="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthlyIntervalSelector;
