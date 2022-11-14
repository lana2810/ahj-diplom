const partition = (items, partNumber) => {
  const startIndex = (partNumber - 1) * 5;
  return [...items].splice(startIndex, 5);
};

module.exports = partition;
