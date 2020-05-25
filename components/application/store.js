const Node = require('./modelNode');

const addNode = async(newNode) => {
    const myNode = new Node(newNode)
    const addNode = await myNode.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addNode
}

const listNode = async(filter) => {
    const node = await Node.find(filter) //Search message with user filter
    return node
}

const updateNode = async (id,address,zone,coords)=>{
    const foundNode = await Node.findOne({
        _id:id
    });
    foundNode.address=address;
    foundNode.zone=zone;
    foundNode.coords=coords;
    await foundNode.save()
}

const deleteNode = (filter) => {
    const removeNode = Node.deleteOne(filter);
    return removeNode
}

const isNodeFeat = async(filter) => {
    const node = await Node.findOne(filter);
    if (node) {
        return true
    }
    return false
}
module.exports = {
    addNode,
    listNode,
    updateNode,
    deleteNode,
    isNodeFeat,
}