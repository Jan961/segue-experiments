import { useState } from 'react';
import axios from 'axios';
import { loggingService } from 'services/loggingService';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FormContainer } from 'components/global/forms/FormContainer';
import { useRouter } from 'next/router';
import { tourEditorMapper } from 'lib/mappers';
import { TourDTO } from 'interfaces';
import { FormInfo } from 'components/global/forms/FormInfo';
import { getTourById, lookupTourId } from 'services/TourService';
import { BreadCrumb } from 'components/global/BreadCrumb';
import { checkAccess, getAccountIdFromReq, getEmailFromReq } from 'services/userService';

type Props = {
  tour: TourDTO;
  showCode: string;
};

const Deletetour = ({ tour, showCode }: Props) => {
  const router = useRouter();
  const back = `/account/shows/${showCode}`;

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
      url: '/api/tours/delete/' + tour.Id,
      data: inputs,
    })
      .then((response) => {
        loggingService.logAction('Show', 'Show Updated');
        setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: true }));
        router.push(back);
      })
      .catch((error) => {
        loggingService.logError(error);
        setStatus((prevStatus) => ({ ...prevStatus, submitting: false, submitted: false }));
      });
  };

  const matching = inputs.Confirmation.toLowerCase() === tour.Code.toLowerCase();

  return (
    <Layout title="Delete Show | Segue">
      <BreadCrumb>
        <BreadCrumb.Item href="/">Home</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account'}>Account</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account/shows'}>Shows</BreadCrumb.Item>
        <BreadCrumb.Item href={back}>{tour.ShowName}</BreadCrumb.Item>
        <BreadCrumb.Item>Delete: {tour.Code}</BreadCrumb.Item>
      </BreadCrumb>
      <FormContainer>
        <div className="mb-4">
          <Link href={back}>
            <FontAwesomeIcon icon={faChevronLeft} />
            &nbsp;Back
          </Link>
        </div>
        <h3 className="text-3xl font-semibold mb-4">
          Delete: {tour.ShowName} - {tour.Code}
        </h3>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent="DANGER">
            Warning. This will delete the tour, and any documents or information associated with it.
          </FormInfo>
          <p className="mb-2">
            Type <b>{tour.Code}</b> in the text field to confirm deletion
          </p>
          <FormInputText name="Confirmation" value={inputs.Confirmation} onChange={handleOnChange} required />
          <FormButtonSubmit disabled={!matching} intent="DANGER" loading={status.submitting} text="Delete Tour" />
        </form>
      </FormContainer>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { TourCode, ShowCode } = ctx.params;

  console.log('hit');

  const AccountId = await getAccountIdFromReq(ctx.req);
  const email = await getEmailFromReq(ctx.req);
  const { Id } = await lookupTourId(ShowCode as string, TourCode as string, AccountId);

  const access = await checkAccess(email, { TourId: Id });
  if (!access) return { notFound: true };

  const tour = await getTourById(Id);

  return { props: { tour: tourEditorMapper(tour), showCode: tour.Show.Code } };
};

export default Deletetour;
