import { RehearsalDTO } from 'interfaces';
import { atom } from 'recoil';

const intialState: Record<number, RehearsalDTO> = {};

export const contractRehearsalState = atom({
  key: 'contractRehearsalState',
  default: intialState,
});
