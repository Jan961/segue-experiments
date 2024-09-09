import { isNullOrEmpty } from './index';

export const formatCoords = (coords) => {
  const { latitude, longitude } = coords;
  return {
    latitude: !isNullOrEmpty(latitude) ? Math.round(latitude * 10000) : null,
    longitude: !isNullOrEmpty(longitude) ? Math.round(longitude * 10000) : null,
  };
};
