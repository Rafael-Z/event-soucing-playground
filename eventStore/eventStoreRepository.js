import { LowSync, JSONFileSync } from 'lowdb'

const adapter = new JSONFileSync('./data/event_store.json')
const db = new LowSync(adapter)

db.read()
db.data = db.data || {events: []}

function saveEvent(e) {
    console.log(`📩 Saving new event ${e.type}`)
    db.data.events.push(e)
    db.write()
}

function getEvents(offset) {
    if (offset >= db.data.events.length) {
        return []
    } else {
        return db.data.events.slice(offset)
    }
}

export default { saveEvent, getEvents }