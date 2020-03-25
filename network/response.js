//exporta esta funcion para ser usada en otro archivo
const success = (req, res, messages, status) => { 
    console.log(status)
    res.status(status || 200).json({//si esta indefined status, responde 200
        'error':'',
        'data':messages
    })
}

const error = (req, res, error, status, message)=>{ //exporta esta funcion para ser usada en otro archivo
    console.error(`[response error] ${message}`)
    res.status(status || 500).json({//si esta indefined status, responde 200
        'error':error,
        'data':''
    })
}

module.exports = {success, error};