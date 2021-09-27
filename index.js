import express from 'express'
import matchCommandApi from './match/command/api.js'
import matchQueryApi from './match/query/match/api.js'
import rankQueryApi from './match/query/rank/api.js'
import topScorerApi from './match/query/topScorers/api.js'

const app = express()
const port = 3000

app.use(express.json());

//COMMAND
app.post('/matches', matchCommandApi.postMatches)
app.patch('/matches/:matchId', matchCommandApi.patchMatch)
app.post('/matches/:matchId/goals', matchCommandApi.postMatchesGoals)

// QUERY
app.get('/matches', matchQueryApi.getMatches)
app.get('/matches/:id', matchQueryApi.getMatchesId)
app.get('/rank', rankQueryApi.getRank)
app.get('/scorers', topScorerApi.getScorers)

// SERVER 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})