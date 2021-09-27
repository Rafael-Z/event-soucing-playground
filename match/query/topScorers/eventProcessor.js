import repo from './repository.js'
import eventStream from '../../../eventStream/eventStream.js'

const onMessage = (topic, event) => {

    if(repo.getIdempotency(event.id)){
        console.log(`⛔️ Skipping duplicate ${event.type}`)
        return;
    }
    
    console.log(`📨 Handling ${event.type}`)

    switch (event.type) {

        case 'MatchGoalScoredEvent': {
            const goal = event.data.goal
            const topScorers = repo.get()
            const scorer = topScorers.find(s => s.name == goal.player)
            if (scorer) {
                scorer.goals++
            } else {
                topScorers.push({ name: goal.player, goals: 1 })
            }
            topScorers.sort((a, b) => b.goals - a.goals)
            repo.save(topScorers)
            break
        }
    }
    repo.saveIdempotency(event.id, true)
}

const start = () => eventStream.subscribe(onMessage)

export default { start }