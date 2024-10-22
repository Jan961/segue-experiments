import { generateUserPassword, generateUserPin } from '../authUtils';

describe('test generateUserPassword', () => {
  it('should return a string that is 8 characters long, with capital letters, small letters, numbers, and symbols', () => {
    const password = generateUserPassword();
    // Regex ensures: at least one lowercase letter, one uppercase letter, one digit, one symbol, exactly 8 characters long
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8}$/;
    expect(regex.test(password)).toBe(true);
    expect(password).toHaveLength(8); // Ensure the length is exactly 8 characters
  });
});

describe('test generateUserPin', () => {
  it('should return a 5 digit number', () => {
    const pin = generateUserPin();
    expect(/^\d{5}$/.test(pin.toString())).toBe(true);
  });
});
