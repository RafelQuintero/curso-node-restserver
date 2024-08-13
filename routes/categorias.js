const { Router } = require('express');
const { check } = require('express-validator');
//!Requerimos el login por lo que reqrimos su ruta

//? Requerimos  la instrccion de validarJWT y la de validarCampo

//?los codigos de las lineas 7 y 8 se pueden resumir desectructurando el middelware:
const { validarJWT, validarCampo, esAdminRole } = require('../middelware');

const {
	creaCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borrarCategoria,
} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validator');

const router = Router();

//crearemos la ruta  de categoria
//* {{url}}/api/categorias
//*Donde el urle es: http://localhost:8080

//? Hagamos una prueba con una peticion get

//TODO:*Rura de Obtener todas las caategorias es un servcio público lo puede utilzar cualquier. Ulilizando el  get.

router.get('/', obtenerCategorias);

//TODO:Fin de rutas de obtenerCategorias.

//TODO:Obtengamos una categoria por el id y es público

router.get(
	'/:id',
	[
		//*Clocaremos todos los controles neceasrio, tale como: validar el id  de de la categoria que esta en la base de datos de mongoAtlas.

		check('id').custom(existeCategoriaPorId),
		//*Como estoy utilizando uno o varios  check o varios; debo colcaer la instuccion validarCampo depues de estos check.

		validarCampo,
	],
	obtenerCategoria,
);

//TODO: Fin de Obtengamos una categoria por el id y es público
//Crear una nueva categoría-es privado-cualquier persona con un token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampo,
	],

	creaCategoria,
);

//Actualizar categoría (es privado), para actualizar una categoría es privado, persona con un tolen valido

router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoriaPorId),

		check('id', 'No es un id de Mongo valido').isMongoId(),
		validarCampo,
	],
	actualizarCategoria,
);

// Crear categoría(es privado), para Borrar una categoría de tener un token valido y debe ser administrador(Admin). Recurede que vamos a marcar  que el estado de estar  activo (true) pase inactivo ( folse).

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo valido').isMongoId(),

		check('id').custom(existeCategoriaPorId),
		validarCampo,
	],
	borrarCategoria,
);

module.exports = router;
