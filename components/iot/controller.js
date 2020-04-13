const storeRoutes = require('./store');
const storeNodes = require('../application/store')
const axios = require('axios')

const hex_to_ascii=(str1)=>{
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

const objectServices=(id,longitude,latitude)=>{
    let out = {
                "id": `${id}`,
                "address": {
                    "location_id": `${id}`,
                    "lon": longitude,
                    "lat": latitude
                }
                ,"size": [
                    1
                ]
                // ,"time_windows": [
                //     {
                //     "earliest": 1554805329,
                //     "latest": 1554806329
                //     }
                // ]
            }
    return out;
}

const arrayNodes=(routes)=>{
    let out = []
    // for(let route of routes){
    //         out.push(route.location_id)
    //     }
    for(let i = 1;i<routes.length-1;i++){
        out.push(routes[i].location_id)
    }
    return out
}

const calculateRoute=(nodes)=>{
    return new Promise((resolve,reject)=>{        
        axios.post(`${process.env.GRAPH_HOPPER_URL}${process.env.GRAPH_HOPPER_KEY}`,
        {
            "vehicles":[{
              "vehicle_id": "monday",
              "start_address": {
                 "location_id": "park",
                 "lon": -74.066058,
                 "lat": 4.633019
              },
              "type_id": "car_type",
              "earliest_start": 28800,
              "latest_end": 57600
               }],
            "vehicle_types":[
               {
                  "type_id": "car_type",
                  "capacity": [
                    10
                    ],
                  "profile": "car"
               }
            ],
            "services":nodes,
            "objectives":[{
                "type":"min",
                "value":"completion_time"
            }],
            "configuration": {
                "routing": {
                "calc_points": false,
                "snap_preventions": []
                }
            }
            }
        )
        .then((res) => {
            if(res.data.solution.routes.length){
                let success={
                    time: res.data.solution.routes[0].completion_time,
                    distance:res.data.solution.routes[0].distance,
                    nodes: arrayNodes(res.data.solution.routes[0].activities)
                }
                resolve(success)
                }else{
                    reject({error:"no route",unassigned:res.data.solution.unassigned,details:res.data.solution.unassigned.details})
                }
        })
        .catch((err) => {
            reject({error:err.message})
        })
    })
}

const addNodeToRoute = (EUI,data)=>{
    return new Promise(async(resolve, reject)=>{
        let node 
        try {
            node = await storeNodes.listNode({eui:EUI})
        } catch (error) {
            reject(error)
        }
        if(node.length===0){
            reject('Node is not registered') 
            return false
        }
        let route;
        try{
            route = await storeRoutes.listRoutes({zone:node[0].zone,status:'new'})
        }catch(e){
            reject(e)
        }
        if(route.length===0){
            //create route
            storeRoutes.addRoute({zone: node[0].zone,status:'new',date:new Date(), nodes:[node[0].id]})
                .then(()=>{
                    resolve("Ok 1")
                })
                .catch(e=>{
                    reject(e)
                })
            
        }else{
            //add node to route
            let upRoute
            try{
                upRoute = await storeRoutes.updateNodesOfRoute(route[0]._id,node[0]._id)
            }catch(e){
                reject(e)
            }
            if(upRoute.nodes.length>2){
            //update status of routes
                let nodesReady=[]
                let nodeAux;
                for(let nodeReady of upRoute.nodes){
                    node = await storeNodes.listNode({_id:nodeReady})
                    nodeAux=objectServices(nodeReady,node[0].coords[0].longitude,node[0].coords[0].latitude)
                    nodesReady.push(nodeAux)
                }
                await calculateRoute(nodesReady)
                    .then(info=>{
                        storeRoutes.updateRouteCalculated(upRoute._id,info)
                        resolve("Ok 3")
                    })
                    .catch(e=>{
                        reject(e)
                    })    
            }
            resolve("Ok 2")
        }
    })
}

const getRoutes = (query)=>{
    return new Promise(async(resolve, reject)=>{
        if (!query) query = {}
        storeRoutes.listRoutes(query)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
}

module.exports={
    addNodeToRoute,
    getRoutes
}