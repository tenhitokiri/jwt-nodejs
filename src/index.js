const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const jtw = require('jsonwebtoken');
const expressValidator = require('express-validator');

//Configuración de Variables de Entorno
// seguir en 42:40
const port = process.env.PORT || 3500;
const db = process.env.DB_CONNECT;

//Conectar a Mongodb
mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Conectada... xD'))
    .catch(err => console.log(err));

//Middleware
app.use(express.json());

//Body parser
app.use(express.urlencoded({
    extended: false
}));

//app.use(expressValidator());


//Ruta de autenticación
const rutaAuth = require('./routes/auth');
app.use('/api/users', rutaAuth);

//Ruta de Posts
const rutaPost = require('./routes/posts');
app.use('/api/posts', rutaPost);

app.use('/',
    (req, res) => {
        res.status(401).send({
            'err': 'error de ruta'
        })
    }
)

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});