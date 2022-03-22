const errorHandler = (err, req, res, next) => {
    console.log(err);
    return res.render('error', { error: err });
}

module.exports = errorHandler;