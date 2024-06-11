import { DealMemoContractFormData } from 'interfaces';
import { useState, useEffect } from 'react';
import axios from 'axios';
export const useFetchDealMemoData = (selectedTableCell) => {
  const [demoModalData, setDemoModalData] = useState<DealMemoContractFormData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTableCell?.contract?.Id) return; // Handle missing ID

      try {
        const response = await axios.get(`/api/dealMemo/getDealMemo/${selectedTableCell.contract.Id}`);
        if (!response.data) {
          throw new Error('Failed to fetch deal memo data');
        }
        const data = await response.data.json();
        setDemoModalData(data as DealMemoContractFormData);
      } catch (error) {
        console.error('Error fetching deal memo data:', error);
      }
    };

    fetchData();
  }, [selectedTableCell]);

  return demoModalData;
};
