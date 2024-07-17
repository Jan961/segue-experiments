import { TextInput } from 'components/core-ui-lib';

export const AddNewPersonInput = () => {
  return (
    <div className="flex mt-2 items-center">
      {/* {newPersonData.first && <div className="w-1/2 flex items-center"> */}
      {/* <div className="text-primary-input-text font-bold mr-4 w-[11vw]">{newPersonData.first}</div> */}
      <div className="w-[22vw] ml-4">
        <TextInput
          className=" text-primary-input-text font-bold w-full"
          disabled
          // value={contactsData.phone}
          // placeholder={
          //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
          // }
        />
      </div>
      {/* </div>} */}

      {/* {newPersonData.second && <div className="w-1/2 flex items-center"> */}
      {/* <div className="text-primary-input-text font-bold  mr-4 w-2/5">{newPersonData.second}</div> */}
      <div className="w-[22vw] ml-4">
        <TextInput
          className=" text-primary-input-text font-bold w-full"
          disabled
          // value={contactsData.email}
          // placeholder={
          //   contactsData.email ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
          // }
        />
      </div>
      {/* </div>} */}
    </div>
  );
};
