import { useEffect, useState } from "react";
import NewValue from "./NewValue";
import EditValue from "./EditValue";
import axios from "axios";
import { userService } from "services/user.service";
import { useRouter } from "next/router";

export interface CustomInputValuesData {
  Id: number | null;
  Name: string;
  Value: string;
  Type: string;
  OwnerId: number | null;
}

const ManageInputOptions = () => {
  const userAccount = userService.userValue;
  const [ActiveEditValue, setActiveEditValue] = useState();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [inputValueData, setInputValueData] = useState<CustomInputValuesData[]>(
    []
  );
  const router = useRouter();

  const fetchInputValues = async () => {
    try {
      const response = await axios.get(`/api/inputValues/read/`);

      setInputValueData(response.data);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching CustomInputValues:", error);
    }
  };

  useEffect(() => {
    if (userAccount && userAccount.segueAdmin === 1) {
      fetchInputValues();
    } else {
      router.push("/");
    }
  }, []);

  const addOption = (options, setOptions) => {
    const value = prompt("Enter a new value:");
    if (value) {
      setOptions([...options, value]);
    }
  };

  const removeOption = (options, setOptions, index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  function handleEditValue(valObject) {
    setActiveEditValue(valObject);
    setShowEditModal(true);
  }

  return (
    <div className="w-100 flex flex-col px-5">
      <div>
        <NewValue />
        <EditValue
          currentInputValue={ActiveEditValue}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
        <div className="flex flex-row space-x-4">
          <h2 className="w-100 underline text-xl font-bold pb-2 mt-5">
            Venue Contact Role
          </h2>
        </div>
        <div className="overflow-y-auto max-h-[33vh]">
          <table className=" max-h-1/2 min-w-full divide-y divide-gray-300">
            <thead className="sticky top-0 text-white">
              <tr className="bg-primary-green">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 rounded-tl-md text-center text-sm font-semibold text-white sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white lg:table-cell rounded-tr-md"
                >
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {inputValueData
                .filter((val) => val.Type === "contactRole")
                .map((role) => (
                  <tr key={role.Id} className="border border-gray">
                    <td className="w-full border-r border-black text-center max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                      {role.Name}
                    </td>
                    <td className="hidden border-r border-black text-center px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {role.Value}
                    </td>
                    <td
                      onClick={() => handleEditValue(role)}
                      className="px-3 cursor-pointer hover:font-bold duration-75 text-center py-4 text-sm text-gray-500"
                    >
                      edit
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row space-x-4">
          <h2 className="w-100 underline text-xl font-bold pb-2 mt-5">
            Business Type
          </h2>
        </div>
        <div className="overflow-y-auto max-h-[33vh]">

        <table className=" max-h-1/2 min-w-full divide-y divide-gray-300">
          <thead className="sticky top-0 text-white">
            <tr className="bg-primary-green">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 rounded-tl-md text-center text-sm font-semibold text-white sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6"
              >
                Value
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-white lg:table-cell rounded-tr-md"
              >
                Activity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {inputValueData
              .filter((val) => val.Type === "businessType")
              .map((role) => (
                <tr key={role.Id} className="border border-gray">
                  <td className="w-full border-r border-black text-center max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                    {role.Name}
                  </td>
                  <td className="hidden border-r border-black text-center px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {role.Value}
                  </td>
                  <td
                    onClick={() => handleEditValue(role)}
                    className="px-3 text-center py-4 text-sm text-gray-500"
                  >
                    edit
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default ManageInputOptions;
