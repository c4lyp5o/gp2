const User = require('../models/User');

const authRegister = async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(201).json({ msg: 'User created', user });
};

module.exports = { authRegister };
