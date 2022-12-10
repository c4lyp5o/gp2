const jwt = require('jsonwebtoken');

const apiKeyVerifier = (req, res, next) => {
  const authKey = req.headers.authorization;

  if (!authKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }

  const decoded = jwt.verify(authKey, process.env.JWT_SECRET);

  if (decoded.apiKey === process.env.API_KEY) {
    next();
  } else {
    return res.status(401).json({ msg: 'Nicer try but please piss off' });
  }
};

module.exports = apiKeyVerifier;
