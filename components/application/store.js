const Node = require('./modelNode');

const isNodeFeat = async (filter)=>{
    const node = await Model.findOne(filter);
    if(node){
        return true
    }
    return false
}

const addNode = async(newNode)=>{
    const myNode = new Node(newNode)
    const addNode = await myNode.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addNode
}

const listNode= async (filter)=>{
    const node = await Node.find(filter)//Search message with user filterUser
    return node
}

const updateNode = async ()=>{
}

const deleteNode = (filter)=>{
    const removeNode = Node.deleteOne(filter);
    return removeNode
}

module.exports={
    addNode,
    listNode,
    updateNode,
    deleteNode,
    isNodeFeat,
}
