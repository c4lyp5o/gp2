const notFound = (req, res) => {
  res.status(404).json({ msg: 'Error: 404, route does not exist' });
};

module.exports = notFound;
