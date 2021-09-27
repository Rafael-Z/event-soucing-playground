import service from './service.js'

const getRank = (req, res) => {
    res.send(service.get())
}

export default { getRank }