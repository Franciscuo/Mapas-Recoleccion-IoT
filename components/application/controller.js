const store = require('./store');
const storeRoutes = require('../iot/store')

const passRandom = () => {
    let str1 = '';
    const abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-", "_", "$", "&", "#", "@"];
    for (var i = 0; i < 15; i++) {
        str1 = str1.padEnd(i + 1, abc[parseInt(Math.random() * abc.length)])
    }
    return str1
}

const isEUI = ((eui) => {
    return new Promise(async(resolve, reject) => {
        if (!eui) {
            reject('Informacion Incorrecta')
            return false
        }
        const filter = {
            eui: eui
        }
        store.isNodeFeat(filter)
            .then((flag) => {
                resolve(flag)
            })
            .catch(e => {
                reject(e)
            })
    })
})

const deleteNode = ((eui) => {
    return new Promise(async(resolve, reject) => {
        if (!eui) {
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const filter = {
            'eui': eui
        }
        store.deleteNode(filter)
            .then((oldNode) => {
                resolve(oldNode)
            })
            .catch(e => {
                reject(e)
            })
    })
})

const addNode = ((eui, model) => {
    return new Promise(async(resolve, reject) => {
        if (!eui) {
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const newNode = {
            'eui': eui,
            'model': model || 'im8080',
            'pass': passRandom(),
        }
        store.addNode(newNode)
            .then((NewNode) => {
                resolve(NewNode)
            })
            .catch(e => {
                reject(e)
            })
    })
})

const getNodes = ((eui, pass) => {
    return new Promise(async(resolve, reject) => {
        let filter = {}
        if (eui) {
            if (pass) {
                filter = {
                    eui: eui,
                    pass: pass
                }
            } else {
                filter = { eui: eui }
            }
        }
        store.listNode(filter)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
})

const getRoutes = ((query) => {
    return new Promise(async(resolve, reject) => {
        if (!query) query = {}
        storeRoutes.listRoutes(query)
            .then((messages) => {
                resolve(messages)
            })
            .catch(e => {
                reject(e)
            })
    })
})

module.exports = {
    addNode,
    getNodes,
    deleteNode,
    isEUI,
    getRoutes,
}