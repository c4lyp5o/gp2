const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
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

const adminAuthInt = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ msg: 'Nice try, but no cigar' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Outstanding!' });
  }
};

module.exports = { adminAuth, adminAuthInt };
