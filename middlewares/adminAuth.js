const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const authKey = req.headers.authorization;
  if (!authKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }
  try {
    const decoded = jwt.verify(authKey, process.env.JWT_SECRET);
    req.user = {
      userAccount: decoded.userAccount,
      accountType: decoded.accountType,
    };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Nicer try' });
  }
};

const adminAuthInt = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userAccount: decoded.userAccount,
      accountType: decoded.accountType,
    };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Nicer try!' });
  }
};

const etlAuth = (req, res, next) => {
  const { 'x-api-key': apiKey } = req.headers;
  if (!apiKey) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }
  next();
};

module.exports = { adminAuth, adminAuthInt, etlAuth };
