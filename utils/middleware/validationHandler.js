const joi = require('@hapi/joi');

function validate(data, schema) {
    const objectJoi = joi.object(schema);
    const { error } = objectJoi.validate(data);
    return error;
}

function validationHandler(schema, check = 'body') { //get body of request and validate
    return function(req, res, next) {
        const error = validate(req[check], schema); // valida si los datos que llegan estan

        error ? next(res.status(402).send({ 'error': 'Datos Invalidos' })) : next();

    };
}

module.exports = validationHandler;