export const generateRandomHash = (size = 16): string => {
  const array = new Uint8Array(size);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
};
