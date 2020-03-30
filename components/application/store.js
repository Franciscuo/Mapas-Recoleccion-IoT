const Node = require('./modelNode');
const Customer = require('./modelCustomer');

const isNodeFeat = async (filter)=>{
    const node = await Model.findOne(filter);
    if(node){
        return true
    }
    return false
}

const addNode = async(newNode)=>{
    const myUser = new Node(newNode)
    const addUser = myUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addUser
}

const listNode= async (filterValue)=>{
    let filter = {}
    if(filterValue){
        filter = {userName:filterValue}//crea el filtr  
    }
    const node = await Node.find(filter)//Search message with user filterUser
    return node
}

const updateNode = async ()=>{
}

const deleteNode = (eui)=>{
    const removeNode = Node.deleteOne({
        eui:eui
    });
    return removeNode
}

const addCustomer = async (newCustomer)=>{
    const myCustomer = new Customer(newCustomer)
    myCustomer.save()
}

const isCustomerFeat = async (filter)=>{
    const node = await Model.findOne(filter);
    if(node){
        return true
    }
    return false
}

module.exports={
    addNode,
    listNode,
    updateNode,
    deleteNode,
    isNodeFeat, 
    addCustomer,
    isCustomerFeat
}
