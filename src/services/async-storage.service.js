
export const storageService = {
    query,
    get,
    post,
    put,
    remove,
}

function query(entityType, delay = 500) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(entities)
        }, delay)   
    })
}


async function get(entityType, currEntityValue) {
    if (!currEntityValue) return
    const entities = await query(entityType);
    const entityToReturn =  entities.find(entity => {
        console.log('getting',currEntityValue)
        if (!isNaN(+currEntityValue)) return entity.key === currEntityValue;
        else return entity.searchValue.toLowerCase().includes(currEntityValue.toLowerCase());
    });
    return entityToReturn;
}
function post(entityType, newEntity) {
    return query(entityType)
        .then(entities => {
           entities ? entities.push(newEntity) : entities = [newEntity];
            _save(entityType, entities)
            return newEntity
        })
}



function put(entityType, updatedEntity) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
            entities.splice(idx, 1, updatedEntity)
            _save(entityType, entities)
            return updatedEntity
        })
}

function remove(entityType, entityId) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === entityId)
            entities.splice(idx, 1)
            _save(entityType, entities)
        })
}


function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}
