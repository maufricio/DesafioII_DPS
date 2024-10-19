const { Router } = require('express');
const router = Router();
const dataController = require('../controllers/dataController');

//routes
router.get('/api/test', (req, res) => {
    const data = {
        "id": "1",
        "name": "API is working"
    }
    res.json(data);
});

//endpoints para ingresos

router.get('/api/listingreso', dataController.listingreso);

router.post('/api/addingreso', dataController.addingreso);

router.delete('/api/deleteingreso/:id', dataController.deleteingreso)

//endpoints para egresos

router.get('/api/listegreso', dataController.listegreso)

router.post('/api/addegreso', dataController.addegreso)

router.delete('/api/deleteegreso/:id', dataController.deleteegreso)

//enpoints para usuairo

router.get('/api/listusuario', dataController.listusuario)

router.post('/api/addusuario', dataController.addusuario)

//endopints para solicitud

router.get('/api/listdetalle', dataController.listdetalle)

router.post('/api/adddetalle', dataController.adddetalle)

module.exports = router;