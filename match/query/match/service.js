import repo from './repository.js'
import eventProcessor from './eventProcessor.js'

eventProcessor.start()

function getAll(){
    return repo.getAll()
}

function get(id){
    return repo.get(id)
}

export default { get, getAll}  