const crypto = require('crypto');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = generateVerificationToken;
