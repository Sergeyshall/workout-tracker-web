const getTimeString = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export {
  getTimeString,
}