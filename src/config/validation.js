const Joi = require('@hapi/joi');

const userValidation = (data) => {
    const Schema = {
        name: Joi.string().min(6).required(),
        email: Joi.min(6).email().required(),
        password: Joi.string().min(8).required(),
        password2: Joi.string().min(8).required()
    };
    return Joi.validate(data, Schema)
}

const loginValidation = (data) => {
    const Schema = {
        email: Joi.min(6).email().required(),
        password: Joi.string.min(8).required(),
    };
    return Joi.validate(data, Schema)
}

module.exports.userValidation = userValidation;
module.exports.loginValidation = loginValidation;