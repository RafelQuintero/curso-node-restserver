const { Router } = require('express');
const { check } = require('express-validator');
//!Requerimos el login por lo que reqrimos su ruta

//? Requerimos  la instrccion de validarJWT y la de validarCampo

//?los codigos de las lineas 7 y 8 se pueden resumir desectructurando el middelware:
const { validarJWT, validarCampo, esAdminRole } = require('../middelware');

const {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
} = require('../controllers/productos');

const {
	existeCategoriaPorId,
	existePorductoPorId,
} = require('../helpers/db-validator');

const router = Router();

//crearemos la ruta  de categoria
//* {{url}}/api/categorias
//*Donde el urle es: http://localhost:8080

//? Hagamos una prueba con una peticion get

//TODO:*Ruta de Obtener todas las productos es un servcio público lo puede utilzar cualquier. Ulilizando el  get.

router.get('/', obtenerProductos);

//TODO:Fin de rutas de obtenerProductos.

//TODO:Obtengamos un producto por el id y es público

router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo valido').isMongoId(),

		check('id').custom(existePorductoPorId),
		//*Clocaremos todos los controles neceasrio, tale como: validar el id  de eñ producto que esta en la base de datos de mongoAtlas.

		//*Como estoy utilizando uno o varios  check o varios; debo colcaer la instuccion validarCampo depues de estos check.

		validarCampo,
	],
	obtenerProducto,
);

//TODO: Fin de Obtengamos un producto } por el id y es público
//Crear una nueva categoría-es privado-cualquier persona con un token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),

		//Tambien necesito ver mi model de productos
		check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('categoria').custom(existeCategoriaPorId), //? Evaluamos  la el producto  y tiene que existirla categoria por id

		validarCampo,
	],

	crearProducto,
);

//Actualizar categoría (es privado), para actualizar una categoría es privado, persona con un tolen valido

router.put(
	'/:id',
	[
		validarJWT,

		//check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existePorductoPorId),
		validarCampo,
	],
	actualizarProducto,
);

// Crear categoría(es privado), para Borrar una categoría de tener un token valido y debe ser administrador(Admin). Recurede que vamos a marcar  que el estado de estar  activo (true) pase inactivo ( folse).

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo valido').isMongoId(),

		check('id').custom(existePorductoPorId),
		validarCampo,
	],
	borrarProducto,
);

module.exports = router;
