import { GetInFitUpDTO } from 'interfaces';
import { atom } from 'recoil';

const intialState: Record<number, GetInFitUpDTO> = {};

export const contractGetInFitUpState = atom({
  key: 'contractGetInFitUpState',
  default: intialState,
});
