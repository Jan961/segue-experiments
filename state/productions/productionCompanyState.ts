import { atom } from 'recoil';

type UIProductionCompany = {
  id: number;
  name: string;
  website: string;
  accountId: number;
};

export type ProductionCompanyList = Partial<UIProductionCompany>[];

const intialState: ProductionCompanyList = [];

export const productionCompanyState = atom({
  key: 'productionCompanyState',
  default: intialState,
});
