const { Router } = require('express');
const { check } = require('express-validator');
//!Requerimos el login por lo que reqrimos su ruta

const { validarCampo, validarArchivoSubir } = require('../middelware');
const {
	cargarArchivo,
	actualizarImagen,
	mostraImagen,
	actualizarImagenCloudinary,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
//crearemos la ruta de la pecon post

const router = Router();

//? Clocoquemos el contolador en una ruta

router.post('/', cargarArchivo);

//? Crearemos la ruta (path)  para subir(guasdar)
//*Será  comentara desde la linea 23 hasta la línea 35 ya que no se va a ulizar clcudinary
// router.put(
// 	'/:coleccion/:id',
// 	[
// 		validarArchivoSubir,
// 		check('id', ' EL id debe ser de mongoDB').isMongoId(),
// 		check('coleccion').custom(
// 			(c) => coleccionesPermitidas(c, ['usuarios', 'productos']), //todo:! : Aquí se define una validación personalizada, donde se creo la funcion coleccionesPermitida la cual verifica  la coleccion representada por "c", si es  un usuario o un producto que estan en un array como argumento de la funcion. Esta debe ser creada. dentro de la carpeta helper y dentro de archivo db-validatorjs
// 		),
// 		validarCampo, //todo!: ckeck no bloquea por lo que debo  colar esta instruccion de validarCampo
// 	],
// 	actualizarImagen,
// ); //* A la ruta  put, le agregue  el argumento llamdo coleecion y tambien el id del elemento que esta en esa coleccion. El segndo argumento  son los middelware sera un array que contendará los check, para validad el id y  la coleccion que viene en los parametros de la request, el ultimo parametro será el contrilador. Pero esra coleccion

//!ruta de actualizar imagen con Cloudinary

router.put(
	'/:coleccion/:id',
	[
		validarArchivoSubir,
		check('id', ' EL id debe ser de mongoDB').isMongoId(),
		check('coleccion').custom(
			(c) => coleccionesPermitidas(c, ['usuarios', 'productos']), //todo:! : Aquí se define una validación personalizada, donde se creo la funcion coleccionesPermitida la cual verifica  la coleccion representada por "c", si es  un usuario o un producto que estan en un array como argumento de la funcion. Esta debe ser creada. dentro de la carpeta helper y dentro de archivo db-validatorjs
		),
		validarCampo, //todo!: ckeck no bloquea por lo que debo  colar esta instruccion de validarCampo
	],
	//actualizarImagen, //YA no la estoy utilzando
	actualizarImagenCloudinary,
); //* A la ruta  put, le agregue  el argumento llamdo coleecion y tambien el id del elemento que esta en esa coleccion. El segndo argumento  son los middelware sera un array que contendará los check, para validad el id y  la coleccion que viene en los parametros de la request, el ultimo parametro será el contrilador. Pero esra coleccion

//!Fin  actualizar imagen con Cloudinary

//? Fin d la Ruta GuarDar Imagenes en el servidor
//? Mostrar o servir  imagenes al cliente
router.get('/:coleccion/:id', [
	check('id', ' EL id debe ser de mongoDB').isMongoId(),
	check('coleccion').custom(
		(c) => coleccionesPermitidas(c, ['usuarios', 'productos']), //todo:! : Aquí se define una validación personalizada, donde se creo la funcion coleccionesPermitida la cual verifica  la coleccion representada por "c", si es  un usuario o un producto que estan en un array como argumento de la funcion. Esta debe ser creada. dentro de la carpeta helper y dentro de archivo db-validatorjs
	),
	validarCampo, //todo!: ckeck no bloquea por lo que debo  colar esta instruccion de validarCampo

	/* Ahora nos crea remps el controlado que ira  despues de validarCampo */

	mostraImagen,
]);
//?Fin de la ruta para mostrar imagenes

module.exports = router;
