const { Router } = require('express'); //* Requerimos la funcion Ruter de express

//TODO :importemos el contorlador de buscar para utilizalo en la ruta despues del chequeo.

const { buscar } = require('../controllers/buscar');

//*Crearemos la  variable para la ruta

const router = Router();

//* La ruta que se estabkecerá es la siuiente:               '/:coleccion/:termino'
router.get('/:coleccion/:termino', buscar);

//* Exportemoslo
module.exports = router;

//* Ahoar nos vamos  al modelo server para especifiar la ruta
