import { useState } from 'react';
import { loggingService } from '../../services/loggingService';

type Props={
  taskIdArray:any[];
  bulkActionField:string;
  closeModal:()=>void;
}

function BulkActionForm({ taskIdArray, bulkActionField, closeModal }:Props) {
  const [updateValue, setUpdateValue] = useState({});

  const handleChange = (event) => {
    setUpdateValue(event.currentTarget.value);
    console.log('the update value', updateValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (taskIdArray.length < 1) {
        const error = new Error();
        error.message = 'no tasks to update';
        throw error;
      }
      const productionTaskIds = taskIdArray; // Replace with actual task IDs to update
      const fieldToUpdate = bulkActionField; // Assuming bulkActionField has a 'value' property
      const newValue = updateValue; // Replace with the new value for the specified field

      const response = await fetch('/api/tasks/update/bulk/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productionTaskIds,
          fieldToUpdate,
          newValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Tasks updated successfully:', data);
        // Perform any necessary UI updates or show a success message
        closeModal();
      } else {
        console.error('Error updating tasks:', data.error);
        // Show an error message to the user
      }
    } catch (error) {
      loggingService.logError(error);

      console.error('Error updating tasks:', error.message);
      // Show an error message to the user
    }
  };

  const renderInput = (bulkActionField) => {
    switch (bulkActionField) {
      case 'Assignee':
        return (
          <select name="assignee" onChange={(e) => handleChange(e)}>
            <option value={0}>Assign a User</option>
            {[].map((usr,i) => {
              return <option key={i} value={usr.UserId}>{usr.UserName}</option>;
            })}
          </select>
        );
      case 'Priority':
        return (
          <select name="priority" onChange={handleChange}>
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        );
      case 'Progress':
        return (
          <select name="Progress" onChange={handleChange}>
            <option value={0}>Not Started</option>
            <option value={10}>10%</option>
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>Completed</option>
          </select>
        );
      case 'FollowUp':
        return (
          <input
            onChange={handleChange}
            type="date"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Select a date"
          />
        );
      case 'Status':
        return (
          <select name="status" onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-col items-center pb-3">
      <p className="text-2xl font-bold w-full text-center">Bulk update tasks ({taskIdArray.length} tasks)</p>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg  text-center font-medium leading-6 text-gray-900">{bulkActionField}</h3>
        </div>
        <div className="border-t flex justify-center my-4 border-gray-200">{renderInput(bulkActionField)}</div>
      </div>
      <div className="flex-row flex justify-around w-full">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          update task
        </button>
        <button
          onClick={closeModal}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BulkActionForm;
