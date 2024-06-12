import { useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { globalState } from 'state/global/globalState';

export default function ReferenceDataLoader() {
  const setState = useSetRecoilState(globalState);
  const getReferenceData = async () => {
    try {
      const { data } = await axios(`/api/email/templates/list`);
      setState((prev) => ({ ...prev, emailTemplates: data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReferenceData();
  }, []);

  return <div />;
}
