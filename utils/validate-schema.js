export default /** @returns {Boolean} */
(schema, toCheck) => {
  let result = true;

  Object.keys(schema).forEach((key) => {
    if (typeof toCheck[key] !== typeof schema[key]) result = false;
  });

  return result;
};
