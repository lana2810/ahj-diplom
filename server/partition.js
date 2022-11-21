const partition = (items, partNumber) => {
  console.log(partNumber);
  const partSize = 5;
  const startIndex = partNumber * partSize;
  return [...items].splice(startIndex, partSize);
};

module.exports = partition;
