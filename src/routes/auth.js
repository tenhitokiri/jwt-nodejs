const router = require('express').Router();
const userModel = require('../models/User');

router.get('/', (req, res) => {
    res.send("Inicio de autenticacion")
})

router.post('/register', async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

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