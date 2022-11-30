const jwt = require('jsonwebtoken');

const authCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const userToken = authHeader.split(' ')[1];
  try {
    const userTokenVerified = jwt.verify(userToken, process.env.JWT_SECRET);
    req.user = {
      userId: userTokenVerified.userId,
      username: userTokenVerified.username,
      accountType: userTokenVerified.accountType,
      negeri: userTokenVerified.negeri,
      daerah: userTokenVerified.daerah,
      kp: userTokenVerified.kp,
      kodFasiliti: userTokenVerified.kodFasiliti,
    };
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};

module.exports = authCheck;
