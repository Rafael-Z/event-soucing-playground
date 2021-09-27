import { LowSync, JSONFileSync } from 'lowdb'

const db = new LowSync(new JSONFileSync('./data/match_projection.json'))

db.read()
db.data = db.data || {matches: {}, idempotency: {} }

function getAll() {
    return { ...db.data.matches }
}

function get(id) {
    return db.data.matches[id] && { ...db.data.matches[id] }
}

function save(match) {
    db.data.matches[match.id] = match
    db.write()
}

function saveIdempotency(key, result) {
    db.data.idempotency[key] = result
    db.write()
}

function getIdempotency(key) {
    return db.data.idempotency[key]
}

export default { get, getAll, save, saveIdempotency, getIdempotency }