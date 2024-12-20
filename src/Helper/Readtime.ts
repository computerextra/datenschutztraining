const calcReadtime = (body: string): number => {
  const avg = 260;
  const words = body.split(" ").length;
  return Math.ceil(words / avg);
};

export { calcReadtime };
