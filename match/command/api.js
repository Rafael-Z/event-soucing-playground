import service from './service.js'

const postMatches = (req, res) => {
    const id = service.createNewMatch(req.body)
    res.header("Location", `/matches/${id}`).status(201).end()
}

const patchMatch = (req, res) => {
    const matchId = req.params.matchId
    try {
        service.patchMatch(matchId, req.body)
        res.status(200).end()
    } catch (err) {
        if(err == "MATCH_NOT_FOUND"){
            res.status(404).send(err)
        } else {
            res.status(422).send(err)
        }
    }
}

const postMatchesGoals = (req, res) => {
    const matchId = req.params.matchId
    try {
        const id = service.createNewGoal(matchId, req.body)
        res.header("Location", `/matches/${matchId}/goals/${id}`).status(201).end()
    } catch (err) {
        res.status(422).send(err)
    }
}

export default { postMatches, patchMatch, postMatchesGoals }