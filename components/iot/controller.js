const storeRoutes = require('./store');
const storeNodes = require('../application/store');
const storeZone = require('../zones/store');
const storeUser = require('../users/store');
const axios = require('axios')

const objectServices = (id, latitude, longitude) => {
    let out = {
        "id": `${id}`,
        "address": {
            "location_id": `${id}`,
            "lon": longitude,
            "lat": latitude
        },
        "size": [
            1
        ]
    }
    return out;
}

const arrayNodes = (routes) => {
    let out = []
    for (let i = 1; i < routes.length - 1; i++) {
        out.push(routes[i].location_id)
    }
    return out
}

const calculateRoute = (nodes, zone) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.GRAPH_HOPPER_URL}${process.env.GRAPH_HOPPER_KEY}`, {
            "vehicles": [{
                "vehicle_id": `vehicle${zone.name}`,
                "start_address": {
                    "location_id": `park${zone.name}`,
                    "lon": zone.start[1],
                    "lat": zone.start[0]
                },
                "end_address": {
                    "location_id": `corp${zone.name}`,
                    "lon": zone.end[1],
                    "lat": zone.end[0]
                },
                "type_id": "small_truck",
                "earliest_start": 28800,
                "latest_end": 57600
            }],
            "vehicle_types": [{
                "type_id": "small_truck",
                "capacity": [
                    zone.capacity
                ],
                "profile": "car"
            }],
            "services": nodes,
            "objectives": [{
                "type": "min",
                "value": "completion_time"
            }],
            "configuration": {
                "routing": {
                    "calc_points": false,
                    "snap_preventions": []
                }
            }
        })
            .then((res) => {
                if (res.data.solution.routes.length) {
                    let success = {
                        time: res.data.solution.routes[0].completion_time,
                        distance: res.data.solution.routes[0].distance,
                        nodes: arrayNodes(res.data.solution.routes[0].activities)
                    }
                    resolve(success)
                } else {
                    reject({ error: "no route", unassigned: res.data.solution.unassigned, details: res.data.solution.unassigned.details })
                }
            })
            .catch((err) => {
                reject({ error: err.message })
            })
    })
}

const addNodeToRoute = (EUI) => {
    return new Promise(async (resolve, reject) => {
        let node
        try {
            node = await storeNodes.listNode({ eui: EUI })
        } catch (e) {
            reject(e)
            return false
        }
        if (node.length === 0) {
            reject('Node is not registered')
            return false
        }
        if (node[0].__v === 0) {
            reject('Node is not sync')
            return false
        }
        let route;
        try {
            route = await storeRoutes.listRoutes({ zone: node[0].zone, status: 'new' })
        } catch (e) {
            console.log(e);
            reject(e)
            return false
        }
        if (route.length === 0) {//because return array
            //create route
            try {
                await storeRoutes.addRoute({ zone: node[0].zone, status: 'new', date: new Date(), nodes: [node[0].id] });
                resolve("Ok 1");
            } catch (e) {
                console.log(e);
                reject(e);
                return false
            }
        } else {
            //add node to route
            let upRoute
            try {
                upRoute = await storeRoutes.updateNodesOfRoute(route[0]._id, node[0]._id)
            } catch (e) {
                console.log(e);
                reject(e)
                return false
            }
            let zone;
            try {
                zone = await storeZone.listZone({ _id: node[0].zone })
            } catch (e) {
                console.log(e);
                reject(e)
                return false
            }
            if (upRoute.nodes.length >= zone[0].capacity) {
                //update status of routes
                let nodesReady = []
                let nodeAux;
                let nodeList;
                for (let nodeReady of upRoute.nodes) {
                    nodeList = await storeNodes.listNode({ _id: nodeReady })
                    await storeUser.update(nodeList[0].owner, null, null, null, [upRoute._id]);//update routes of client
                    nodeAux = objectServices(nodeReady, nodeList[0].coords[0], nodeList[0].coords[1])
                    nodesReady.push(nodeAux)
                }
                try {
                    const infoRoute = await calculateRoute(nodesReady, zone[0]);//calculate route
                    await storeRoutes.updateRouteCalculated(upRoute._id, infoRoute)//update state routes
                    if (zone[0].worker) {
                        await storeUser.update(zone[0].worker, null, null, null, [upRoute._id]);//update routes of worker
                    }
                    resolve("Ok 3")
                    return true
                } catch (e) {
                    console.log(e);
                    reject(e);
                    return false
                }
            }
            resolve("Ok 2")
            return true
        }
    })
}

const getRoutes = (query) => {
    return new Promise(async (resolve, reject) => {
        if (!query) {
            query = {}
        }
        storeRoutes.listRoutes(query)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
}

module.exports = {
    addNodeToRoute,
    getRoutes
}