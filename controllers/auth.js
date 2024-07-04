//* Manejaremos la fucncion que controlara la ruta del login y lo que sera enviado desde el body cunado se haga la peticion y que todo esta cocot tanto el correo como el password soliictudes importantes para que un usirio exista

const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generear-jwt');
const { googleverify } = require('../helpers/google-verify');

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

const googleSigIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { correo, nombre, img } = await googleverify(id_token);

		//?console.log({ correo, nombre, img });

		let usuario = await Usuario.findOne({ correo }); //!Buscamos el usuruiro que contiene ese correo, pero debesoa chequearlo, si el existe.

		//*Chequemos que el usuario exista ?

		if (!usuario) {
			//*Crearemos el usuario ya que el ususrio no existe con el nombre de "data".
			const data = {
				nombre,
				correo,
				password: 'Cualquier cosa Okey, ',
				img,
				google: true,
			};

			//*creamos con esa data el nuevo usorio
			usuario = new Usuario(data);
			//*Ahora debemos grabar ese usurio en la base de datos
			console.log({ usuario });

			await usuario.save();
		} //*Ahra verificaremos si el el esuario esta en la DB pero esta  en estado fase (no esta habilitado) se le negará la autenticacion.

		if (!usuario.estado) {
			return res.status.json({
				msg: 'Hable con el administrador, usuario bloqueado',
			});
		}
		//* Ahora  debemos generar el json wed token (JWT)

		const token = await generarJWT(usuario.id);
		res.json({
			usuario,
			token,
		});
	} catch (error) {
		json.status(400).json({
			ok: false,
			msg: 'El token no se pudo verificar',
		});
	}
};

module.exports = {
	login,
	googleSigIn,
};
