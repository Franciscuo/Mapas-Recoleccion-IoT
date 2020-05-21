const Model = require('./model');

const addUser = async(newUser)=>{
    const myUser = new Model(newUser)
    myUser.password = await myUser.encryptPassword(newUser.password);
    const addUser = myUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addUser
}
//Son funciones asincronas porque tienen que esperar que retorne algo la base de datos que funciona con promesas
const  getUsers= async (filter)=>{
    const user = await Model.find(filter)//Search message with user filterUser
    return user
}

const updateUser = async (id,id_node,role)=>{
    const foundUser = await Model.findOne({
        _id:id
    });
    if(id_node){
        foundUser.role = role,
        foundUser.nodes.push({_id:id_node})
    }
    await foundUser.save()

}

const deleteUser = (id)=>{
    const removeUser = Model.deleteOne({
        _id:id
    });
    return removeUser
}

const isUserFeat = async (filter)=>{
    const user = await Model.findOne(filter);
    if(user){
        return true
    }
    return false
}

module.exports={
    add: addUser,
    list: getUsers,
    update: updateUser,
    remove: deleteUser,
    isUserFeat: isUserFeat
}
