import { v4 as uuid } from 'uuid'
import eventStore from '../../eventStore/eventStoreRepository.js'
import eventProcessor from './state/eventProcessor.js'
import stateRepo from './state/repository.js'

const SYNC_STATE_UPDATE = true

if(!SYNC_STATE_UPDATE){
  eventProcessor.start()
}

function createNewMatch(match) {

  const event = {
    type: 'MatchCreatedEvent',
    id: uuid(),
    ts: Date.now(),
    data: {
      match: {
        id: uuid(),
        home:{
          team: match.home.team
        }, 
        visiting: {
          team: match.visiting.team
        },
        round: match.round,
        date: match.date
      }
    }
  }

  eventStore.saveEvent(event)
  if(SYNC_STATE_UPDATE){
    eventProcessor.onMessage(null, event)
  }
  return event.data.match.id
}

function patchMatch(matchId, match) {

  const matchCurrentState = stateRepo.get(matchId)
  if(!matchCurrentState){
    throw "MATCH_NOT_FOUND"
  }

  if(match.status == "FINISHED"){
    if(matchCurrentState.status != "NEW"){
      throw "MATCH_STATUS_NOT_ALLOWED"
    }
    const event = {
      type: 'MatchFinishedEvent',
      id: uuid(),
      ts: Date.now(),
      data: {
        match: {
          id: matchId
        }
      }
    }

    eventStore.saveEvent(event)
    if(SYNC_STATE_UPDATE){
      eventProcessor.onMessage(null, event)
    }
  }
}

function createNewGoal(matchId, goal) {

  const matchCurrentState = stateRepo.get(matchId)
  if(!matchCurrentState){
    throw "INVALID MATCH"
  }
  if(matchCurrentState.home.team != goal.team && matchCurrentState.visiting.team != goal.team){
    throw "INVALID TEAM"
  }
  
  const event = {
    type: 'MatchGoalScoredEvent',
    id: uuid(),
    ts: Date.now(),
    data: {
      goal: {
        id: uuid(),
        matchId,
        team: goal.team,
        player: goal.player
      }
    }
  }
  eventStore.saveEvent(event)
  if(SYNC_STATE_UPDATE){
    eventProcessor.onMessage(null, event)
  }
  return event.data.goal.id
}

export default { createNewMatch, patchMatch, createNewGoal }
