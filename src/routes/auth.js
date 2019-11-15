 const router = require('express').Router();
 const userModel = require('../models/User');
 const emailValidator = require('email-validator');
 const {
     userValidation
 } = require('../config/validation');

 const {
     check,
     oneOf,
     body,
     validationResult
 } = require('express-validator');

 router.get('/', (req, res) => {
     res.send("Inicio de autenticacion")
 })

 router.post('/register', async (req, res) => {
     const {
         name,
         email,
         password,
         password2
     } = req.body;

     //Validar datos ingresados
     let errors = [];
     let msg = '';

     //esto hay que probar porque no sirve
     /*      const {
              error
          } = userValidation(req.body);
          if (error) return res.status(400).send(error)
      */
     //check req fields
     if (!name || !email || !password || !password2) {
         msg = 'Por favor llenar todos los campos';
         errors.push({
             msg
         })
     }

     //Check valid email
     if (!emailValidator.validate(email)) {
         msg = 'Por favor Colocar un correo valido';
         errors.push({
             msg
         })

     }

     // Verificar largo de contraseña
     if (password.length < 8) {
         msg = 'La contraseña debe ser de mas de 8 caracteres'
         errors.push({
             msg
         })
     }
     //Verificar claves iguales
     if (password2 !== password) {
         msg = 'Las contraseñas no coinciden';
         errors.push({
             msg
         })
     }
     //exit if error on recived data
     if (errors.length > 0) {
         return res.status(400).send(errors);
     }

     //validar que el usuario no exista
     await userModel.findOne({
         email
     }).then((user) => {
         if (user) {
             res.status(400).send({
                 "error": "Usuario ya existe!"
             })
             return
         } else {

             const user = new userModel({
                 name,
                 email,
                 password
             });
             user.save().then((savedUser) => {
                 res.send(savedUser)
             }).catch((err) => {
                 console.log(`error: ${err}`);
                 res.status(400).send(err);
             })
         }
     }).catch((err) => {
         console.log(`error: ${err}`);
         res.status(400).send(err);
     })

 })

 module.exports = router;