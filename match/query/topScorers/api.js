import service from './service.js'

const getScorers = (req, res) => {
    res.send(service.get())
}

export default { getScorers }
