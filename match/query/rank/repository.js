import { LowSync, JSONFileSync } from 'lowdb'

const db = new LowSync(new JSONFileSync('./data/rank_projection.json'))

db.read()
db.data = db.data || { rank: [], ongoingMatches: {}, idempotency: {} }

function get() {
    return db.data.rank
}

function save(rank) {
    db.data.rank = rank
    db.write()
}

function getOngoingMatch(id) {
    return { ...db.data.ongoingMatches[id] }
}

function removeOngoingMatch(id) {
    delete db.data.ongoingMatches[id]
    db.write()
}

function saveOngoingMatch(match) {
    db.data.ongoingMatches[match.id] = match
    db.write()
}

function saveIdempotency(key, result) {
    db.data.idempotency[key] = result
    db.write()
}

function getIdempotency(key) {
    return db.data.idempotency[key]
}

export default { get, save, getOngoingMatch, saveOngoingMatch, removeOngoingMatch, saveIdempotency, getIdempotency }