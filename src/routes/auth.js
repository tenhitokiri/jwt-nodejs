 const router = require('express').Router();
 const userModel = require('../models/User');
 const emailValidator = require('email-validator');
 const jwt = require('jsonwebtoken');

 const bcript = require('bcryptjs');
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
     }).then(async (user) => {
         if (user) {
             res.status(400).send({
                 "error": "Usuario ya existe!"
             })
             return
         } else {
             //Encrptar contraseñas
             const salt = await bcript.genSalt(10);
             const hashPassword = await bcript.hash(password, salt);
             const user = new userModel({
                 name,
                 email,
                 password: hashPassword
             });
             console.log(user)
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

 router.post('/login', async (req, res) => {
     const {
         email,
         password
     } = req.body;
     //Validar datos ingresados
     let errors = [];
     let msg = '';


     //Revisar datos validos
     if (!email || !password) {
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
     //exit if error on recived data
     if (errors.length > 0) {
         return res.status(400).send(errors);
     }
     //validar que el usuario exista

     const validUser = await userModel.findOne({
         email
     })
     const validPassword = await bcript.compare(req.body.password, validUser.password)
     if (!validUser || !validPassword) return res.status(400).send({
         'err': 'Usuario o Contraseña Inválida'
     });
     //Crear el jwt
     const token = jwt.sign({
         _id: validUser._id
     }, process.env.TOKEN_SECRET)
     res.header('auth-token', token).send(token);
     /*      res.send({
              'msg': `Bienvenido ${validUser.name}`
          });
      */
 })


 module.exports = router;