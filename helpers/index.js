const dbValidators = require('./db-validator');
const generarJWT = require('./generear-jwt');
const googleVerify = require('./google-verify');
const subiArchivo = require('./subir-archivo');

/* Hacemos la exportacion de todos los achivos que contiene  indexe.js  para poder utilizarlos en oro lugar*/

module.exports = {
	//Vamoos a exparcir todo su contenido en cada un de ellos , utilzando los tres puntitoa
	...dbValidators,
	...generarJWT,
	...googleVerify,
	...subiArchivo,
};
