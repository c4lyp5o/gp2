const dashboard = async (req, res) => {
    try {
        const { username, name } = req.user;
        res.status(200).json({ msg: `Selamat datang Dr ${name}` });
    } catch (error) {
        res.status(401).json({ msg: 'Please log in' });       
    }
}

module.exports = dashboard;