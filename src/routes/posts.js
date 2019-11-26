const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'mi primer titulo',
            description: 'algo que no se debería leer si no se está autenticado'
        }
    })
})

module.exports = router;