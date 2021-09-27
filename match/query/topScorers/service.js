import repo from './repository.js'
import eventProcessor from './eventProcessor.js'

eventProcessor.start()

function get() {
    return repo.get()
}

export default { get }