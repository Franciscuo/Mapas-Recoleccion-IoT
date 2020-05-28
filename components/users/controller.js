const store = require('./store');
const storeNode = require('../application/store')
const storeZone = require('../zones/store');

const isUserName = (userName)=>{
    return new Promise(async(resolve,reject)=>{
        if(!userName){
            reject('Informacion Incorrecta')
            return false
        }
        const filter={
            userName:userName
        }
        store.isUserFeat(filter)
            .then((flag)=>{
                resolve(flag)
            })
            .catch(e=>{
                reject(e)
            })
    })
}

const isEmail = (email)=>{
    return new Promise(async(resolve,reject)=>{
        if(!email){
            reject('Informacion Incorrecta')
            return false
        }
        const filter={
            email:email
        }
        store.isUserFeat(filter)
            .then((flag)=>{
                resolve(flag)
            })
            .catch(e=>{
                reject(e)
            })
    })
}

const addUser = (userName, name, lastName, email, password, zone)=>{
    return new Promise(async(resolve, reject)=>{
        const newUser = {}
        if(zone){
            newUser = {
                'userName': userName,
                'name': name,
                'lastName': lastName,
                'email': email,
                'password': userName,
                'role':'worker',
                'date':new Date(),
            }
        }else{
            newUser = {
                'userName': userName,
                'name': name,
                'lastName': lastName,
                'email': email,
                'password': password,
                'role':'none',
                'date':new Date(),
            }
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
        store.remove(id)
            .then(()=>{
                resolve()
            })
            .catch(e=>{
                reject(e)
            })
    })
})

const syncNode = (user_id, eui, pass, address, zone, lat, lon)=>{
    return new Promise(async(resolve,reject)=>{
     if(!user_id||!eui||!pass||!address||!zone||!lat||!lon){
        reject('Informacion Incorrecta') // retorna promesa
        return false
    }
    const node = await storeNode.listNode({eui:eui,pass:pass})
    if(node.length===0){
        reject('Datos incorrectos') // retorna promesa
        return false
    }
    if(node[0].address){
        reject('Nodo Ya Registrado')
        return false
    }

    let coords = [lat,lon];
    const idZone = await storeZone.listZone({number:zone});
    console.log(idZone)
    Promise.all([storeNode.updateNode(node[0]._id,address,idZone[0]._id,coords),store.update(user_id,node[0]._id,'client')])
        .then(()=>{
            console.log("Sincronizado Cliente");
            resolve("Success")
        })
        .catch(e=>{
            reject(e)
        })
    })
}

module.exports={
    isUserName,
    isEmail,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    syncNode
}