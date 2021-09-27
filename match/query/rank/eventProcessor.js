import repo from './repository.js'
import eventStream from '../../../eventStream/eventStream.js'

const onMessage = (topic, event) => {

    if(repo.getIdempotency(event.id)){
        console.log(`⛔️ Skipping duplicate ${event.type}`)
        return;
    }
    
    console.log(`📨 Handling ${event.type}`)

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
                }
            }
            repo.saveOngoingMatch(match)
            break
        }

        case 'MatchGoalScoredEvent': {
            const match = repo.getOngoingMatch(event.data.goal.matchId)
            if (event.data.goal.team == match.home.team) {
                match.home.score++
            } else if (event.data.goal.team == match.visiting.team) {
                match.visiting.score++
            }
            repo.saveOngoingMatch(match)
            break
        }

        case 'MatchFinishedEvent': {
            const match = repo.getOngoingMatch(event.data.match.id)
            const chart = repo.get()

            var home = chart.find(t => t.team == match.home.team)
            if(!home){
                home = {team: match.home.team, points: 0, goalDiff: 0}
                chart.push(home)
            }
            var visiting = chart.find(t => t.team == match.visiting.team)
            if(!visiting){
                visiting = {team: match.visiting.team, points: 0, goalDiff: 0}
                chart.push(visiting)
            }

            if (match.home.score > match.visiting.score) {
                home.points += 3
            } else if (match.home.score < match.visiting.score) {
                visiting.points += 3
            } else {
                home.points++
                visiting.points++
            }

            home.goalDiff += match.home.score - match.visiting.score
            visiting.goalDiff += match.visiting.score - match.home.score

            chart.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)

            repo.save(chart)
            repo.removeOngoingMatch(event.data.match.id)
            break
        }
    }
    repo.saveIdempotency(event.id, true)
}

const start = () => eventStream.subscribe(onMessage)

export default { start }