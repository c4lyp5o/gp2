const UserModel = require('../models/User');

const authLogin = async (req,res) => {
    const { username, password } = req.body;

    if (!username || !password ) {
        return res.status(400).json({ msg: 'Please provide username and password'});
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ msg: 'Ivalid credentials'});
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ msg: 'Invalid credentials'});
    }

    const token = user.createJWT();
    res.status(200).json({ msg: `Welcome ${user.name}`, token });
}

module.exports = authLogin;