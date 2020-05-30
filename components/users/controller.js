const store = require('./store');
const storeNode = require('../application/store')
const storeZone = require('../zones/store');
const storeRoutes = require('../iot/store');

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

const addUser = (userName, name, lastName, email, password, zone=undefined, phone=undefined)=>{
    return new Promise(async(resolve, reject)=>{
        let addUser = {}
        if(zone){//is user is worker. password equal user name
            addUser = {
                'userName': userName,
                'name': name,
                'lastName': lastName,
                'email': email,
                'password': userName,
                'role':'worker',
                'phone':phone,
                'routes':[],
                'date':new Date(),
            }
        }else{
            addUser = {
                'userName': userName,
                'name': name,
                'lastName': lastName,
                'email': email,
                'password': password,
                'role':'none',
                'routes':[],
                'date':new Date(),
            }
        }
        try{
            let newUser= await store.add(addUser);
            if(zone){
                const zoneUp = await storeZone.updateZone(zone, null, null, null, newUser._id);
                const routes = await storeRoutes.listRoutes({status:'resolved',zone:zoneUp._id});
                if(routes.length!==0){
                    const arrayRoutes = routes.map(route=>(route._id));
                    newUser= await store.update(newUser._id,null,null,null,arrayRoutes);
                }
            }
            resolve(newUser);
        }catch(e){
            reject(e);
        }
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

const updateUser = ((data)=>{
    return new Promise(async(resolve,reject)=>{
        const {id,phone,route} = data;
        store.update(id,null,phone,route)
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
    Promise.all([storeNode.updateNode(node[0]._id,address,idZone[0]._id,coords,user_id),store.update(user_id,node[0]._id,'client',null,[])])
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