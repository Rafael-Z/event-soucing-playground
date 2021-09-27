import repo from './repository.js'
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
                    team: event.data.match.home.team,
                    score: 0
                },
                visiting: {
                    team: event.data.match.visiting.team,
                    score: 0
                },
                status: "NEW",
                round: event.data.match.round,
                date: event.data.match.data
            }
            repo.save(match)
            break
        }

        case 'MatchGoalScoredEvent': {
            const match = repo.get(event.data.goal.matchId)
            if (event.data.goal.team == match.home.team) {
                match.home.score += 1
            } else if (event.data.goal.team == match.visiting.team) {
                match.visiting.score += 1
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

export default { start }