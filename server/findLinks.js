/* eslint-disable no-useless-escape */
const findLinks = (text) => {
  const regexp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const res = text.match(regexp);
  return res;
};
module.exports = findLinks;
