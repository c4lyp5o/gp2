const dashboard = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(401).json({ msg: 'Please log in' });       
    }
}

module.exports = dashboard;