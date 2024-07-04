const { Router } = require('express');
const { check } = require('express-validator');
//!Requerimos el login por lo que reqrimos su ruta

const { validarCampo } = require('../middelware/validar-campo');

const { login, googleSigIn } = require('../controllers/auth');

//crearemos la ruta de la pecon post

const router = Router();

router.post(
	'/login',
	[
		check('correo', 'EL CORREO ES OBLIGATORIO').isEmail(),
		check('password', 'LA CONTRASEÑA ES OBLIGATORIO').not().isEmpty(),
		validarCampo,
	],
	login,
);

router.post(
	'/google',
	[
		check('id_token', 'ID_TOKEN DE GOOGLE ES NECESARIO').not().isEmpty(),

		validarCampo,
	],
	googleSigIn,
);

module.exports = router;
