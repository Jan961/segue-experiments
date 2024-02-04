import { ProductionDTO } from 'interfaces';
import { atom } from 'recoil';

export interface ProductionsList {
  values: Partial<ProductionDTO>[];
}

const intialState: ProductionsList = {
  values: [],
};

export const productionsList = atom({
  key: 'productionsList',
  default: intialState,
});
