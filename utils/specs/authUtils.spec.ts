import { generateUserPassword, generateUserPin } from '../authUtils';

describe('test generateUserPassword', () => {
  it('should return a string that is 8 characters long, with capital letters, small letters, numbers and symbols', () => {
    const password = generateUserPassword();
    expect(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/.test(password)).toBe(true);
  });
});

describe('test generateUserPin', () => {
  it('should return a 5 digit number', () => {
    const pin = generateUserPin();
    expect(/^\d{5}$/.test(pin.toString())).toBe(true);
  });
});
