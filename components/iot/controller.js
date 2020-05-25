const storeRoutes = require('./store');
const storeNodes = require('../application/store')
const storeZone = require('../zones/store')
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
        } catch (error) {
            reject(error)
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
            reject(e)
        }
        if (route.length === 0) {//because return array
            //create route
            storeRoutes.addRoute({ zone: node[0].zone, status: 'new', date: new Date(), nodes: [node[0].id] })
                .then(() => {
                    resolve("Ok 1")
                })
                .catch(e => {
                    reject(e)
                })
        } else {
            //add node to route
            let upRoute
            try {
                upRoute = await storeRoutes.updateNodesOfRoute(route[0]._id, node[0]._id)
            } catch (e) {
                reject(e)
            }
            let zone
            try {
                zone = await storeZone.listZone({ _id: node[0].zone })
            } catch (e) {
                reject(e)
            }
            if (upRoute.nodes.length >= zone[0].capacity) {
                //update status of routes
                let nodesReady = []
                let nodeAux;
                for (let nodeReady of upRoute.nodes) {
                    node = await storeNodes.listNode({ _id: nodeReady })
                    nodeAux = objectServices(nodeReady, node[0].coords[0], node[0].coords[1])
                    nodesReady.push(nodeAux)
                }

                await calculateRoute(nodesReady, zone[0])
                    .then(info => {
                        storeRoutes.updateRouteCalculated(upRoute._id, info)
                        resolve("Ok 3")
                    })
                    .catch(e => {
                        reject(e)
                    })
            }
            resolve("Ok 2")
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