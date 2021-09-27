import { LowSync, JSONFileSync } from 'lowdb'

const db = new LowSync(new JSONFileSync('./data/top_scorers_projection.json'))

db.read()
db.data = db.data || {topScorers: [], idempotency: {}}

function get() {
    return db.data.topScorers
}

function save(topScorers) {
    db.data.topScorers = topScorers
    db.write()
}
 
function saveIdempotency(key, result) {
    db.data.idempotency[key] = result
    db.write()
}

function getIdempotency(key) {
    return db.data.idempotency[key]
}

export default { get, save, saveIdempotency, getIdempotency }