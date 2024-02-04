import { useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';

import { productionsList } from 'state/productions/productionsState';

export default function ReferenceDataLoader() {
  const setProductionsList = useSetRecoilState(productionsList);

  const getProductions = async () => {
    const values = await axios.get(`/api/productions/read/productionsList`);
    return values;
  };

  const getReferenceData = async () => {
    const { data: accountId } = await axios.get(`/api/account/read`);
    console.log(accountId);
    // TODO Save account Id in global state so we don't have keep fetching from Prisma everytime

    const productionsResponse = await getProductions();

    setProductionsList({ values: productionsResponse.data.productions });
  };

  useEffect(() => {
    getReferenceData();
  }, []);

  return <div></div>;
}
