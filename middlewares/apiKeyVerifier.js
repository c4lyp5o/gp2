const CryptoJS = require('crypto-js');

const apiKeyVerifier = (req, res, next) => {
  const authKey = req.headers.authorization;
  const { apiKey } = req.body;

  if (!authKey && !apiKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }

  const bytes = CryptoJS.AES.decrypt(
    authKey || apiKey,
    process.env.CRYPTO_JS_SECRET
  );
  const decipheredText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  if (decipheredText === process.env.API_KEY) {
    next();
  } else {
    return res.status(401).json({ msg: 'Nicer try but please piss off' });
  }
};

module.exports = apiKeyVerifier;
