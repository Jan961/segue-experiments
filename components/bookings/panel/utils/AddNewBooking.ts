export const getTimeInMins = (time: string): number => {
  const [hrs = 0, min = 0] = time?.split(':').map((x) => parseInt(x, 10)) || [0, 0];
  return hrs * 60 + min;
};
