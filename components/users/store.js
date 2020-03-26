const Model = require('./model');
const bcrypt = require('bcryptjs'); //Hash de contraseña

const encryptPassword = async (password) => { //se define un metodo para el esquema que permite encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const addUser = async(newUser)=>{
    newUser.password = await encryptPassword(newUser.password);
    const myUser = new Model(newUser)
    const addUser = myUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
    return addUser
}
//Son funciones asincronas porque tienen que esperar que retorne algo la base de datos que funciona con promesas
const  getUsers= async (filterName)=>{
    let filter = {}
    if(filterName!=null){
        filter = {userName:filterName}//crea el filtr  
    }
    //const messages = await Model.find()//Search all message
    const user = await Model.find(filter)//Search message with user filterUser
    return user
}

const updateUser = async (id,name)=>{
    const foundMessage = await Model.findOne({
        _id:id
    });//obtiene el documento del mensaje y actualiza el campo message
    foundUser.message=name
    const newUser = await foundUser.save()
    return newUser
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
