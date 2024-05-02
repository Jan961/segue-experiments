import { ProductionDTO } from 'interfaces';
import { atom } from 'recoil';

export interface ContractsProductionJump {
  productions: Partial<ProductionDTO>[];
  loading?: boolean;
  selected: number;
  includeArchived?: boolean;
  path?: string;
}

export const intialState: ContractsProductionJump = {
  productions: [],
  loading: false,
  includeArchived: false,
  selected: undefined,
  path: undefined,
};

export const contractsProductionJumpState = atom({
  key: 'contractsProductionJumpState',
  default: intialState,
});
