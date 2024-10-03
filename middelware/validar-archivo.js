const { response, request } = require('express');

const validarArchivoSubir = (req = request, res = response, next) => {
	//todo: EL tercer parámetro de valiadrArchivoSubir, es para que,  si lo de abajo no ocurre que valla a la siguiente validacion.
	if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res
			.status(400)
			.json({ msg: 'No hay archivo que subir-validarArchivoSubir' });
	}
	next();
};

module.exports = {
	validarArchivoSubir,
};
