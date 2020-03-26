const store = require('./store');

const addUser = (userName,name, lastName,email,password)=>{
    return new Promise(async(resolve, reject)=>{
        if (!userName||!name||!lastName||!email||!password){
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const newUser = {
            'userName': userName,
            'name': name,
            'lastName': lastName,
            'email': email,
            'password': password,
            'admin':false,
            'collector':false,
            'date':new Date(),
        }
        store.add(newUser)
            .then((NewUser)=>{
                resolve(NewUser)
            })
            .catch(e=>{
                reject(e)
            })
    })
}

const getUser=((filterUser)=>{
    return new Promise(async(resolve, reject)=>{
        store.list(filterUser)
            .then((messages)=>{
                resolve(messages)
            })
            .catch(e=>{
                reject(e)
            })
    })
})

const updateUser = ((id,name)=>{
    return new Promise(async(resolve,reject)=>{
        store.update(id,name)
            .then(()=>{
                resolve('Actualizo Usuario')
            })
            .catch(e=>{
                reject(e)
            })
    })
})

const deleteUser = ((id)=>{
    return new Promise((resolve,reject)=>{
        if(!id){
            reject('Invalid data')
            return false;
        }
        store.remove(id)
            .then(()=>{
                resolve()
            })
            .catch(e=>{
                reject(e)
            })
    })
})

module.exports={
    addUser, 
    getUser,
    updateUser,
    deleteUser,
}