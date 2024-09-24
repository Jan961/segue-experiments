import { isNullOrEmpty } from './index';

export const formatCoords = (coords) => {
  const { latitude, longitude } = coords;
  //  The 10000 value is to make the coordinates to 4 decimal places for efficient storage as integers.
  return {
    latitude: !isNullOrEmpty(latitude) ? Math.round(latitude * 10000) : null,
    longitude: !isNullOrEmpty(longitude) ? Math.round(longitude * 10000) : null,
  };
};
