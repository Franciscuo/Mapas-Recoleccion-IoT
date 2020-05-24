const storeZone = require('./store');

const getZones = (query) => {
    return new Promise(async(resolve, reject) => {
        if (!query) {
            query = {}
        }
        await storeZone.listZone(query)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
}

const addZone = (number, name, start, end, capacity) => {
    return new Promise(async(resolve, reject) => {
        const newZone = {
            name,
            number,
            capacity,
            start,
            end
        }
        await storeZone.addZone(newZone)
            .then(() => {
                resolve("Success")
            })
            .catch(e => {
                reject(e)
            })
    })
}


const updateZone = (numberZone, start, end, capacity) => {
    return new Promise(async(resolve, reject) => {

        if (!numberZone) {
            reject('Informacion Incorrecta') // retorna promesa
            return false;
        }

        await storeZone.updateZone(numberZone, start, end, capacity)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
}



module.exports = {
    addZone,
    getZones,
    updateZone
}