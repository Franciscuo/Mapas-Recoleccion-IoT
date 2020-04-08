//exporta esta funcion para ser usada en otro archivo
const success = (req, res, messages, status) => { 
    console.log(status)
    res.header({
        "custom-header":"Nuestro Valor"
    })//Responde cabeceras
    res.status(status || 200).send({//si esta indefined status, responde 200
        'error':'',
        'message':messages
    })
}

const error = (req, res, error, status, message)=>{ //exporta esta funcion para ser usada en otro archivo
    console.error(`[response error] ${message}`)
    res.status(status || 500).send({//si esta indefined status, responde 200
        'error':error,
        'message':''
    })
}

module.exports = {success, error};