//TODO ,En este archivo user.js . Crearemos las rutas relacionadas con los usorios.
//TODO; Del paquete express obtengamos una funcion llamada Router por medio de la desestrcturacion.

const { Router } = require('express');

//todo: Importaremos de la carpeta controllers la funcions usuariosGet para utilzarla como referncia en router.get.

const {
	usuariosGet,
	usuariosPOST,
	usuariosPUT,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios');

// Creamos un constante llamada ruoter, que conterndar todas las funciones de Router

const router = Router();

//? al ruter les vamos a configurar las rutas  la cual estan definidas como se muestr¿tran abajo.

router.get('/', usuariosGet);

router.post('/', usuariosPOST);
//* Si se quire modificar un ususrio cualquiera, lo parciamos con un "id" para poder hacerlo dinamico.
router.put('/:id', usuariosPUT);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);
//? Exprotemos por defecto router
module.exports = router;
