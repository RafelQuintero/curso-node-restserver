//TODO ,En este archivo user.js . Crearemos las rutas relacionadas con los usorios.
//TODO; Del paquete express obtengamos una funcion llamada Router por medio de la desestrcturacion.
const { Router } = require('express');
const { check } = require('express-validator');
//! optemomos el metodo check para utilizarla como verificador alg , en este caso el correo.

//todo: Importaremos de la carpeta controllers la funcions usuariosGet para utilzarla como referncia en router.get.

const {
	usuariosGet,
	usuariosPOST,
	usuariosPUT,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios');

const { ExpressValidator } = require('express-validator');

//? Optimzemos las linea 20 21 y 22  que vienen del mis directorio llamado middelware, unificaremos los res archivos de abajo en uno solo. utilzando algo propio de NODEJS. Creando un nuevo archivo llamado index.js en el diectorio middelware

//?const { validarCampo } = require('../middelware/validar-campo'); //* se hizo el requerimiento de validarCampo
//?const { validarJWT } = require('../middelware/validar-jwt.js');
//?const { esAdminRole, tieneRole } = require('../middelware/validar-roles.js');
//* Imprtemos
const {
	validarCampo,
	validarJWT,
	esAdminRole,
	tieneRole,
} = require('../middelware'); //*el index no se necesiat escribirlo en la ruta, ya que se busca por defecto

//? Fin de la optimacion

//* importemos el modelo  Role, lo quitamos y lo colcamos en el archivo db-validator.js de la carpeta helpers

//? importamos los metodos de  validacon de el archivo db-validatio.js
const {
	esRolvalido,
	emailExiste,
	existeUsuaroPorId,
} = require('../helpers/db-validator.js');
const role = require('../models/role.js');

// Creamos un constante llamada ruoter, que conterndar todas las funciones de Router

const router = Router();

//? al ruter les vamos a configurar las rutas  la cual estan definidas como se muestr¿tran abajo.

router.get('/', usuariosGet);

//! donde van [] que es un arreglo,  para hacer varios middelwares;  el segundo parametos y  sera lo que se ejecurá como milldelware; ya que el tercer paramtro sera el conrolador de la ruta: usuariosPOST

router.post(
	'/',

	//* Con check(---, ---, ---) que es un middelware creado con expres_validator; chemaremos  todos los campos que son obligatorio  y que vienen   en la request del body que es cuerpo del ModelSchema; donde  por ejemplo: el primer parametro, es el correo que se esta validamdo, el segundo parametro  es el mensage que se quiere que se vea y .isEmail() el para decir que es un correo de verdad es lo que esta dentro del middelware ckeck.
	//*  Como se van a crear varios chequeos  con check , se debe  estar todos check dentro  de un array.
	//* Cada check  va almacenado los errores que va ocurrioendo y  los va almacenado  en un array para  el request  y  luego se le pedira al  validationResult(req) para generar los errores que ocurrierón

	[
		check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
		check('password', 'EL PASSWORD DEBE SER DE 6 LETRAS COMO MÍNIMO').isLength({
			min: 6,
		}),
		check('correo', 'EL CORREO NO ES VALIDO').isEmail(),

		//*cheque el correo para que no este registrado en la coleccio de usiarrio de mongodbAtlas
		check('correo').custom(emailExiste),

		//?check('rol', 'NO ES rol  VALIDO').isIn(['ADMIN_ROLE', 'USER_ROLE']),

		//* Realizaremos un rol pesonalizado en vez del anterior (señalado  el la linea anterior)

		check('rol').custom(esRolvalido), //? el parametro que recibe cuestom() es extamente igual que escribir custom( (rol) => esRolvalido(rol) ), aclaratoria: como el argumento (rol ) es exactamente igual al argumeto que tiene esRolvalido(rol),  puedo omitirlo y solo escribir dentro de custom(esRolvalido)

		validarCampo, //* el middelware de validad todo los parametros obligatorio en el modelo de mongoDBATLAS
	],

	usuariosPOST,
);
//* Si se quiere modificar un ususrio cualquiera, lo parciamos con un "id" para poder hacerlo dinamico.

router.put(
	'/:id',
	[
		//* se quiere hacer validacion de id que se sea vlaido en mongoDBATLAS , lo haremos con el
		//* check() de express-validator
		check(
			'id',
			' NO ES  UN id DE MONGODB-ATLAS VALIDO ENVIADO EN EL "param" ',
		).isMongoId(),

		check('id').custom(existeUsuaroPorId),

		check('rol').custom(esRolvalido), //* Debemos validar el rol nuevamente ya que es un capo obligattorio

		validarCampo, //*siempre debo validadar los campos obligatorios; de lo contrario dispará un error.
	],

	usuariosPUT, //? este es el metodo del controlador de la ruta que nos dara la informacion de la actualizacion
);

router.patch('/', usuariosPatch);

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole, //?eSTE MIDDELWARE OBLIGA QUE EL USUARiO TIENE QUE SER ADMINISTRADOR

		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), //?ESTE MIDDELWARE  es mas flexible que contenga como argumentos 'ADMIN_ROLE','VENTAS_ROLE'
		check(
			'id',
			' NO ES  UN id DE MONGODB-ATLAS VALIDO ENVIADO EN EL "param" ',
		).isMongoId(),
		check('id').custom(existeUsuaroPorId), //? Cheque que xista un usuario con ese id en DB
		validarCampo,
	],
	usuariosDelete,
);
//? Exprotemos por defecto router
module.exports = router;
