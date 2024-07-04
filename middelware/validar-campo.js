const { validationResult } = require('express-validator');

const validarCampo = (req, res, next) => {
	const errors = validationResult(req);
	//Verifiquemos el el nombre , password,correo y rol que son validos.
	if (!errors.isEmpty()) {
		return res.status(400).json(errors); //ve escribe los errors que consiguio check como middelware,
	}
	next(); //* Ne indica que sigue con el siguiente middelware, si ny ms tomara el control de la ruta
};

module.exports = {
	validarCampo,
};
