export const getTimeInMins = (time: string) => {
  const [hrs = 0, min = 0] = time.split(':').map((x) => parseInt(x, 10));
  return hrs * 60 + min;
};
