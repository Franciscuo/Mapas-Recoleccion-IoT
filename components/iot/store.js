const Routes = require('./modelRoutes');

const listRoutes = query => {
    const routes = Routes.find(query)
    return routes;
}

const addRoute = async(newRoute) => {
    const myRoute = new Routes(newRoute)
    await myRoute.save()
}

const updateNodesOfRoute = async(id, node) => { // Cuando se llena un nodo sin sobrepasar la campacidad del camión
    const foundRoute = await Routes.findOne({
        _id: id
    });
    foundRoute.nodes.push(node);
    const newRoute = await foundRoute.save()
    return newRoute
}

const updateRouteCalculated = async(id, info) => { // Cuando se llena un nodo se sobrepasa la campacidad del camión
    const foundRoute = await Routes.findOne({
        _id: id
    });

    foundRoute.nodes = info.nodes
    foundRoute.distance = info.distance
    foundRoute.time = info.time
    foundRoute.status = "resolved"
    foundRoute.date = new Date()
    await foundRoute.save()
}


module.exports = {
    listRoutes,
    addRoute,
    updateNodesOfRoute,
    updateRouteCalculated

}