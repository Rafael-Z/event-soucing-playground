import repo  from './repository.js'
import eventStream from '../../../eventStream/eventStream.js'

const onMessage = (topic, event) => {

    if(repo.getIdempotency(event.id)){
        console.log(`⛔️ Skipping duplicate ${event.type}`)
        return;
    }

    console.log(`📨 Handling event ${event.type}`)

    switch (event.type) {

        case 'MatchCreatedEvent': {
            const match = {
                id: event.data.match.id,
                home: {
                    team: event.data.match.home.team
                },
                visiting: {
                    team: event.data.match.visiting.team
                },
                status: "NEW"
            }

            repo.save(match)
            break
        }

        case 'MatchFinishedEvent': {
            const match = repo.get(event.data.match.id)
            match.status = 'FINISHED'
            repo.save(match)
            break
        }
    }
    repo.saveIdempotency(event.id, true)
}

const start = () => eventStream.subscribe(onMessage)

export default { start, onMessage }