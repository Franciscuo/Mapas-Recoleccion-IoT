const Model = require('./model');

const addNode = async(newNode)=>{
    const myUser = new Model(newNode)
    const addUser = myUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addUser
}
//Son funciones asincronas porque tienen que esperar que retorne algo la base de datos que funciona con promesas
const  getNode= async (filterValue)=>{
    let filter = {}
    if(filterValue){
        filter = {userName:filterValue}//crea el filtr  
    }
    const node = await Model.find(filter)//Search message with user filterUser
    return node
}

const updateNode = async ()=>{
}

const deleteNode = (eui)=>{
    const removeNode = Model.deleteOne({
        eui:eui
    });
    return removeNode
}

const isNodeFeat = async (filter)=>{
    const node = await Model.findOne(filter);
    if(node){
        return true
    }
    return false
}

module.exports={
    add: addNode,
    list: getNode,
    update: updateNode,
    remove: deleteNode,
    isUserFeat: isNodeFeat 
}
