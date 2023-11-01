import { UserDto } from 'interfaces';
import { atom } from 'recoil';

export interface UserState {
  users: Record<number, UserDto>;
}

const intialState: UserState = {
  users: {},
};

export const userState = atom({
  key: 'userState',
  default: intialState,
});
