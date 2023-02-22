export const generateRandomColor = (): string => {
  const MIN = 100;
  const MAX = 150;

  return `rgb(${getRandomNumber(MIN, MAX)}, ${getRandomNumber(
    MIN,
    MAX
  )}, ${getRandomNumber(MIN, MAX)})`;
};

const getRandomNumber = (min: number, max: number): number =>
  Math.trunc(Math.random() * (max + 1)) + min;
