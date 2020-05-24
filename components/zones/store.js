const Zones = require('./modelZone');


const addZone = async(newUser) => {
    const myZone = new Zone(newUser)
    return myZone
}

const listZone = query => {
    const Zones = Zones.find(query)
    return Zones;
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