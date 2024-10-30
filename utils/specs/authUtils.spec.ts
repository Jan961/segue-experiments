import { generateUserPassword, generateUserPin, validatePassword, validatePin } from '../authUtils';

describe('test generateUserPassword', () => {
  it('should return a string that is 8 characters long, with capital letters, small letters, numbers, and symbols', () => {
    const password = generateUserPassword();
    expect(validatePassword(password)).toBe(true);
    expect(password).toHaveLength(8); // Ensure the length is exactly 8 characters
  });
});

describe('test generateUserPin', () => {
  it('should return a 5 digit number', () => {
    const pin = generateUserPin();
    const { valid } = validatePin(pin);
    console.log(valid);
    expect(valid).toBe(true);
  });
});

describe('test validatePin', () => {
  it('It is Exactly 5 digits long, Does not contain more than 2 consecutive numbers, Does not contain fully ascending or descending sequences.', () => {
    expect(validatePin(34195).valid).toBe(true);
  });

  it('It is Exactly 5 digits long. Passing 4 digits', () => {
    const { valid, message } = validatePin(3419);
    expect(valid).toBe(false);
    expect(message).toBe('Not a 5-digit number');
  });

  it('It is Exactly 5 digits long. Passing 2 digits', () => {
    const { valid, message } = validatePin(19);
    expect(valid).toBe(false);
    expect(message).toBe('Not a 5-digit number');
  });

  it('It does not contain fully ascending or descending sequences', () => {
    const { valid, message } = validatePin(12345);
    expect(valid).toBe(false);
    expect(message).toBe('All numbers in sequence ascending or descending');

    const { valid: desc, message: descMsg } = validatePin(54321);
    expect(desc).toBe(false);
    expect(descMsg).toBe('All numbers in sequence ascending or descending');
  });

  it('It does not contain more than 2 consecutive numbers', () => {
    const { valid, message } = validatePin(13335);
    expect(valid).toBe(false);
    expect(message).toBe('More than 2 consecutive numbers');

    const { valid: desc, message: descMsg } = validatePin(55521);
    expect(desc).toBe(false);
    expect(descMsg).toBe('More than 2 consecutive numbers');
  });
});
