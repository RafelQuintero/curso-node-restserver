const { request, response } = require('express');

const jwt = require('jsonwebtoken');

//*REequerimos el modedeloo del Usuario para obtener el uid de la base de datos
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
	//? Debo obtener el  JWT token que se quiere , como es un tpken de acceso se aostumbra que valla en los header;  en key le coloco el  nombre que quiera, pero como es un token personalizado le doy el nombre de x-token y en value:  : coloco el codigo del token autenticado.
	//* Pbtenremos e token de la request(petición)
	const token = req.header('x-token');
	//?Validemos el token

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}
	try {
		//? Validamos el token con la siguienete funcion de jwt y extraemos el uid de la vericacion y lugor lo grabamos en la req  creando la propeidad req.uid =uid.

		const { uid } = jwt.verify(token, process.env.SECRETOPRIVETEKEY);
		//?Vamos de guardar  en la requst=req el usuario uid que es el id de mongoDBAltalas

		const usuario = await Usuario.findById(uid);

		//! Tambien hagamos la validación si el usuario existe en la base de datos  de mongoDB Atlas porque si no existe debe dar un undefined.

		if (!usuario) {
			return res.status(401).json({
				msg: 'Token no valido - usuario no existe  en DB',
			});
		}

		//!Verificar si el usuario del uid  tiene el estado  en true; por lo tanton el token sera valido de lo contrario no lo es.

		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Token no valido-usuaro con estado: false ',
			});
		}

		//*Ähora lo guardamos en  la req creando la porpiedad req.usuarrio =usuario
		req.usuario = usuario;

		next(); //
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no valido',
		});
	}

	//*console.log(token); eliminamos esta linea, ya que comprobamos que si se está generando el token  de  un usuario
};

module.exports = {
	validarJWT,
};
