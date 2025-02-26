import axios from 'axios';
import { BreadCrumb } from 'components/global/BreadCrumb';
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit';
import { FormContainer } from 'components/global/forms/FormContainer';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { FormInputText } from 'components/global/forms/FormInputText';
import { ProductionDTO } from 'interfaces';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loggingService } from 'services/loggingService';

interface ProductionEditorProps {
  production: ProductionDTO;
  showCode: string;
}

export const ProductionEditor = ({ showCode, production }: ProductionEditorProps) => {
  const router = useRouter();
  const back = `/account/shows/${showCode}`;
  const editMode = !!production.Id;

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
  });

  const [inputs, setInputs] = useState(production);

  // Modified to handle arrays
  const handleOnChange = (e) => {
    const { id, value } = e.target;
    if (e.target.id.includes('_')) {
      const index = id.split('_')[0];
      const field = id.split('_')[1];
      setInputs((prev) => {
        const newInputs = { ...prev };
        newInputs.DateBlock[index][field] = value;
        return newInputs;
      });
    } else {
      setInputs((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true });

    if (editMode) {
      axios({
        method: 'POST',
        url: '/api/productions/update/' + production.Id,
        data: inputs,
      })
        .then(() => {
          loggingService.logAction('Production', 'Update');
          setStatus({ submitted: true, submitting: false });
          router.push(back);
        })
        .catch((error) => {
          loggingService.logError(error);
          setStatus({ submitted: false, submitting: false });
        });
    } else {
      axios({
        method: 'POST',
        url: '/api/productions/create/',
        data: inputs,
      })
        .then(() => {
          loggingService.logAction('Production', 'Add  Production');
          setStatus({ submitted: true, submitting: false });
          router.push(back);
        })
        .catch((error) => {
          loggingService.logError(error);
          setStatus({ submitted: false, submitting: false });
        });
    }
  };

  const addBlock = () => {
    const newInputs = { ...inputs };
    newInputs.DateBlock.push({ Name: '', StartDate: null, EndDate: null });
    setInputs(newInputs);
  };

  const removeBlock = (indexToRemove) => {
    const newInputs = { ...inputs };
    newInputs.DateBlock = inputs.DateBlock.filter((x, i) => i !== indexToRemove);
    setInputs(newInputs);
  };

  return (
    <>
      <BreadCrumb>
        <BreadCrumb.Item href="/">Home</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account'}>Account</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account/shows'}>Shows</BreadCrumb.Item>
        <BreadCrumb.Item href={back}>{production.ShowName}</BreadCrumb.Item>
        <BreadCrumb.Item>{editMode ? `Edit: ${production.Code}` : 'Add Production'}</BreadCrumb.Item>
      </BreadCrumb>
      <FormContainer>
        <form onSubmit={handleOnSubmit}>
          <FormInputText
            label="Code"
            value={inputs.Code}
            name="Code"
            placeholder="XYZABC"
            onChange={handleOnChange}
            required
          />
          <FormInputCheckbox label="Archived" value={inputs.IsArchived} name="IsArchived" onChange={handleOnChange} />
          {inputs.DateBlock.map((db, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded mb-2">
              <div className="grid grid-cols-3 gap-x-2">
                <FormInputText
                  placeholder="Block name"
                  label="Name"
                  value={db.Name}
                  name={`${index}_Name`}
                  onChange={handleOnChange}
                  required
                />
                <FormInputDate
                  label="Start"
                  value={db.StartDate}
                  name={`${index}_StartDate`}
                  onChange={handleOnChange}
                  required
                />
                <FormInputDate
                  label="End"
                  value={db.EndDate}
                  name={`${index}_EndDate`}
                  onChange={handleOnChange}
                  required
                />
              </div>
              <div className="text-right">
                <FormInputButton intent="DANGER" text="Delete" onClick={() => removeBlock(index)} />
              </div>
            </div>
          ))}
          <FormInputButton text="Add Date Block" className="block w-full mb-2" onClick={addBlock} />
          <FormButtonSubmit
            text={editMode ? 'Save Production' : 'Create Production'}
            disabled={status.submitted}
            loading={status.submitting}
          />
        </form>
      </FormContainer>
    </>
  );
};
