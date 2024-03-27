//?validaremos  si el usuario es del rol adimnistrador

const { response, request } = require('express');

const esAdminRole = (req = request, res = response, next) => {
	//* Como el middelware validarJWT valida el usuario que tiene el token  esto ya existe y esta activo establece la informacion del mismo usuario; establecioendolo   en la req.usuario = usuario; por consecuencia   cualquier peticion u otro middelware en el cual venga despues  de validar el jsonwebtoken  del usuario , por lo que no tengo que volver hacer una peticon de validacion. Por lo que tomaremos la siguiente validacion: Esta validacion se hace para ver que estamos llamando correctamente este ususario  ADIN_ROLE. Si req.usuario ese undefined siginifica que no hemos validado correcatmente  la peticon de el token de ese ususrio

	if (!req.usuario) {
		return res.status(500).json({
			msg: 'Se quiere verificar el rol sin validar el token primero',
		});
	}
	//* Que quiero de la request

	const { rol, nombre } = req.usuario; //* Este usuario fue el que se autentico con el token y el role es el que tiene en la DB

	if (rol != 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${nombre} no es adminsitrador-No puede hacer esto`,
		});
	}
	//* Pero si es Admistrador llamo a la instruccuin de abajo y lo dejo pasar.
	next();
};

const tieneRole = (...roles) => {
	return (req = request, res = response, next) => {
		//console.log(roles, req.usuario.rol); //* Mostremos en la terminal los argumentos  como un arreglo que necesito para que pase este middelware
		//* LA validacion de abajo es para ver que tengo el token de usuraio  autenticado
		if (!req.usuario) {
			return res.status(500).json({
				msg: 'Se quiere verificar el rol sin validar el token primero',
			});
		}

		if (!roles.includes(req.usuario.rol)) {
			return res.status(401).json({
				msg: `El servicio requere uno de estos roles ${roles}`,
			});
		}
		next();
		//* HAgamos la validacion
	};
};
module.exports = {
	esAdminRole,
	tieneRole,
};
