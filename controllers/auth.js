//* Manejaremos la fucncion que controlara la ruta del login y lo que sera enviado desde el body cunado se haga la peticion y que todo esta cocot tanto el correo como el password soliictudes importantes para que un usirio exista

const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generear-jwt');

//? Login de usuario

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		//*Vereficar si el el usirio existe , si  existe el correo, existe el usuario.
		const usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario/password no son correctos. correo',
			});
		}
		//* verificar si el usuario esta activo, estaodo == true
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Usuario/password no son correctos. estado : false',
			});
		}
		//* Verificquemos la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario/password no son correctos. password',
			});
		}
		//* Generar el JWT
		const token = await generarJWT(usuario.id);
		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			mes: 'Hable con el Administrador',
		});
	}
};

module.exports = {
	login,
};
