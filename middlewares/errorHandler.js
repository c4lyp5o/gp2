const errorHandler = (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong"});
}

module.exports = errorHandler;