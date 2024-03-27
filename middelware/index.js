const validaCampo = require('../middelware/validar-campo'); //* se hizo el requerimiento de validarCampo
const validaJWT = require('../middelware/validar-jwt.js');
const validaRoles = require('../middelware/validar-roles.js');

module.exports = {
	...validaCampo,
	...validaJWT,
	...validaRoles,
};
