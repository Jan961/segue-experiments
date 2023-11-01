import { useState } from 'react';
import axios from 'axios';
import { loggingService } from 'services/loggingService';
import Layout from 'components/Layout';
import { getShowById, lookupShowCode } from 'services/ShowService';
import { GetServerSideProps } from 'next';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit';
import { FormContainer } from 'components/global/forms/FormContainer';
import { useRouter } from 'next/router';
import { showMapper } from 'lib/mappers';
import { ShowDTO } from 'interfaces';
import { FormInfo } from 'components/global/forms/FormInfo';
import { BreadCrumb } from 'components/global/BreadCrumb';
import { getEmailFromReq, checkAccess, getAccountId } from 'services/userService';

type Props = {
  show: ShowDTO;
};

const DeleteShow = ({ show }: Props) => {
  const router = useRouter();

  const [status, setStatus] = useState({
    submitted: true,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({ Confirmation: '' });

  const handleOnChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true, submitted: false }));
    axios({
      method: 'POST',
      url: '/api/shows/delete/' + show.Id,
      data: inputs,
    })
      .then((response) => {
        loggingService.logAction('Show', 'Show Updated');
        setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: true }));
        router.push('/account/shows');
      })
      .catch((error) => {
        loggingService.logError(error);
        setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: false }));
      });
  };

  const matching = inputs.Confirmation.toLowerCase() === show.Code.toLowerCase();

  return (
    <Layout title="Delete Show | Segue">
      <BreadCrumb>
        <BreadCrumb.Item href="/">Home</BreadCrumb.Item>
        <BreadCrumb.Item href="/account">Account</BreadCrumb.Item>
        <BreadCrumb.Item href="/account/shows">Shows</BreadCrumb.Item>
        <BreadCrumb.Item>Delete: {show.Name}</BreadCrumb.Item>
      </BreadCrumb>
      <FormContainer>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent="DANGER">
            Warning. This will delete the show and all tours, documents, and information associated with it.
          </FormInfo>
          <p className="mb-2">
            Type <b>{show.Code}</b> in the text field to confirm deletion
          </p>
          <FormInputText name="Confirmation" value={inputs.Confirmation} onChange={handleOnChange} required />
          <FormButtonSubmit disabled={!matching} intent="DANGER" loading={status.submitting} text="Delete Show" />
        </form>
      </FormContainer>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode } = ctx.params;

  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);
  const ShowId = await lookupShowCode(ShowCode as string, accountId);
  const access = await checkAccess(email, { ShowId });
  if (!access) return { notFound: true };

  const show = await getShowById(ShowId);

  return { props: { show: showMapper(show) } };
};

export default DeleteShow;
