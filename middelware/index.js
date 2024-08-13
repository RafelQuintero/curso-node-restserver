const validarCampo = require('../middelware/validar-campo'); //* se hizo el requerimiento de validarCampo
const validarJWT = require('../middelware/validar-jwt.js');
const validaRoles = require('../middelware/validar-roles.js');

module.exports = {
	...validarCampo,
	...validarJWT,
	...validaRoles,
};
