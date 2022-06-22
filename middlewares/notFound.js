const notFound = (req, res) => {
  res.status(404).send('Error : 404, Route does not exist');
};

module.exports = notFound;
