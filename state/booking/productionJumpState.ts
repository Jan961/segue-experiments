import { ProductionDTO } from 'interfaces';
import { atom } from 'recoil';

export interface ProductionJump {
  productions: Partial<ProductionDTO>[];
  loading?: boolean;
  selected: number;
  includeArchived?: boolean;
  path?: string;
}

const intialState: ProductionJump = {
  productions: [],
  loading: false,
  includeArchived: false,
  selected: undefined,
  path: undefined,
};

export const productionJumpState = atom({
  key: 'productionJumpState',
  default: intialState,
});
