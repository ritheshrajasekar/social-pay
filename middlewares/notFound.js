const notFound = (req, res) => res.status(404).send('Endpoint does not exist')

module.exports = { notFound}