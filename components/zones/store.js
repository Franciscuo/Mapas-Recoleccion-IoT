const Zones = require('./modelZone');


const addZone = async(newZone) => {
    const myZone = new Zones(newZone)
    return await myZone.save();
}

const listZone = async(query) => {
    const zone = await Zones.find(query)
    return zone;
}

const updateZone = async(number, start=undefined, end=undefined, capacity=undefined, worker=undefined) => {
    const foundZone = await Zones.findOne({
        number: number
    });
    if (start) foundZone.start = start
    if (end) foundZone.end = end
    if (capacity) foundZone.capacity = capacity
    if (worker) foundZone.worker = worker
    const updateZone = foundZone.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return updateZone;
}

module.exports = {
    addZone,
    listZone,
    updateZone
}