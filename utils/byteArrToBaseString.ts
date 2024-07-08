const byteArrToBaseString = (uintArray) => {
  const byteArray = new Uint8Array(uintArray);
  const binaryString = byteArray.reduce((data, byte) => {
    return data + String.fromCharCode(byte);
  }, '');

  return btoa(binaryString);
};

export default byteArrToBaseString;
