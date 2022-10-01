const simpleCrypto = require('simple-crypto-js').default;

const apiKeyVerifier = (req, res, next) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }

  const crypt = new simpleCrypto(process.env.API_SECRET);
  const decipheredText = crypt.decrypt(apiKey);

  if (decipheredText === process.env.API_KEY) {
    next();
  } else {
    return res.status(401).json({ msg: 'Nicer try but please piss off' });
  }
};

module.exports = apiKeyVerifier;
