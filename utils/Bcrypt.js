const bcrypt = require("bcrypt");

exports.hashSomething = async (data) => {
  const salt = await bcrypt.genSalt();
  hashed = await bcrypt.hash(data, salt);
  return hashed;
};

exports.unHashSomething = async (input, comparer) => {
  return await bcrypt.compare(input, comparer);
};
