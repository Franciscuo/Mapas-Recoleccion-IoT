const store = require('./store');

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

const isEUI = (eui)=>{
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
}

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
        store.add(newNode)
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
        store.list(filter)
            .then((messages)=>{
                resolve(messages)
            })
            .catch(e=>{
                reject(e)
            })
    })
})


module.exports={
    isEUI,
    addNode, 
    getNodes,
}