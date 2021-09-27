import service from './service.js'

const getMatches = (req, res) => {
    res.send(service.getAll())
}

const getMatchesId = (req, res) => {
    const match = service.get(req.params.id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).end()
    }
}

export default { getMatches, getMatchesId }
