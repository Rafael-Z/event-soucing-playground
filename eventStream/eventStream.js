import PubSub from 'pubsub-js'
import eventStore from '../eventStore/eventStoreRepository.js'

const TOPIC = "MATCH_EVENTS"
const eventStorePoolingInMilisec = 2000

var offset = 0

const process = () => eventStore.getEvents(offset).forEach(e => {
    PubSub.publish(TOPIC, e);
    offset++
})

setInterval(process, eventStorePoolingInMilisec)

const subscribe = (callback) => {
    PubSub.subscribe(TOPIC, callback)
}

export default { subscribe }