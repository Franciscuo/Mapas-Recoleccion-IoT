const store = require('./store');

const isEUI = ((eui)=>{
    return new Promise(async(resolve,reject)=>{
        if(!eui){
            reject('Informacion Incorrecta')
            return false
        }
        const filter={
            eui:eui
        }
        store.isNodeFeat(filter)
            .then((flag)=>{
                resolve(flag)
            })
            .catch(e=>{
                reject(e)
            })
    })
})

const addNode = (eui,model,customer_id,)=>{
    return new Promise(async(resolve, reject)=>{
        if (!eui||!model||!customer_id){
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const newNode = {
            'eui': eui,
            'model':model,
            'customer_id': customer_id,
        }
        store.addNode(newNode)
            .then((NewNode)=>{
                resolve(NewNode)
            })
            .catch(e=>{
                reject(e)
            })
    })
}

const getNodes=((filter)=>{
    return new Promise(async(resolve, reject)=>{
        store.listNode(filter)
        .then((messages)=>{
            resolve(messages)
        })
        .catch(e=>{
            reject(e)
        })
    })
})

const isEmail = ((email)=>{
    return new Promise(async(resolve,reject)=>{
        if(!email){
            reject('Informacion Incorrecta')
            return false
        }
        const filter={
            email:email
        }
        store.isCustomerFeat(filter)
            .then((flag)=>{
                resolve(flag)
            })
            .catch(e=>{
                reject(e)
            })
    })
})

const addCustomer = (address,latitude,longitude,phone,name,email,node)=>{
    return new Promise(async(resolve, reject)=>{
        if (address||!latitude||!longitude||!phone||!name||!email){
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const newCustomer = {
                'address':address,
                'latitude':latitude,
                'longitude':longitude,
                'phone':phone,
                'name':name, 
                'email':email,
                'node':''
        }
        if (node)
            newCustomer.node=node
        store.addCustomer(newCustomer)
            .then((NewCustomer)=>{
                resolve(NewCustomer)
            })
            .catch(e=>{
                reject(e)
            })
    })
}


module.exports={
    addNode, 
    getNodes,
    isEUI,
    addCustomer,
    isEmail
}