export interface LocalUser {
  id: number;
  email: string;
  name: string;
  accountId: number;
  accountOwner: number;
  accountAdmin: number;
  segueAdmin: number;
  token: string;
}
