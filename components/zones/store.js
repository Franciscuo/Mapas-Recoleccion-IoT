const Zones = require('./modelZone');


const addZone = async(newZone) => {
    const myZone = new Zones(newZone)
    return await myZone.save();
}

const listZone = async(query) => {
    console.log(query)
    const zone = await Zones.find(query)
    return zone;
}

const updateZone = async(number, start, end, capacity) => {
    const foundZone = await Zones.findOne({
        number: number
    });
    if (start) foundZone.start = start
    if (end) foundZone.end = end
    if (capacity) foundZone.capacity = capacity
    await foundZone.save()
}

module.exports = {
    addZone,
    listZone,
    updateZone
}