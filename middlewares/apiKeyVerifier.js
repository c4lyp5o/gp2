const rateLimit = require('express-rate-limit');
const simpleCrypto = require('simple-crypto-js').default;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const apiKeyVerifier = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const crypt = new simpleCrypto(process.env.API_SECRET);
  const decipheredText = crypt.decrypt(apiKey);
  if (decipheredText === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ msg: 'Unauthorized' });
  }
};

module.exports = { limiter, apiKeyVerifier };
