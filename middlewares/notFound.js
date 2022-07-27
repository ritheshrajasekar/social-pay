const notFound = (req, res) => res.status(404).send('Endpoint doeds not exist')

module.exports = { notFound}