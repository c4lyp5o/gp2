const jwt = require('jsonwebtoken');

const apiKeyVerifier = (req, res, next) => {
  const authKey = req.headers.authorization;
  if (!authKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }
  try {
    const decoded = jwt.verify(authKey, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Nicer try' });
  }
};

module.exports = apiKeyVerifier;
