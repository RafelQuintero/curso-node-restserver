//?En este archivo  usuarios.js ,  crearemos funciones y la exportaremos
//! Obtenemos la funncion reponse de  del paquete express para que cuando hagamos la solicitud res.cuaquier cusa, aprarezca la ayuda.
const { response } = require('express');

const usuariosGet = (req, res = response) => {
	//? Desectruraremso la informacion que necesto, que viene del query
	//! En la peticon "req" las solicitudes se piden; de la siguiente manera:
	const {
		q = 'no date', //*  Aparece esta informacion, si no se le manda la informacion en la url (ejemplo: http://localhost:8080/api/usuarios?q=PEPE&nombre=FERNANDO&apikey=12345) cuando se hace la peticion
		nombre = 'no name', //*La misma documentacion que la anterior
		apikey,
		page = 1, //*La misma documentacion que la anterior
		list = 20, //*La misma documentacion que la anterior
	} = req.query;

	res.json({
		ok: true,
		msg: 'ES UNA PETICION   GET API-  DESDE EL CONTROLADOR : La cual muestra todo lo registros de  una colección ',
		q,
		nombre,
		apikey,
		page,
		list,
	});
};

const usuariosPOST = (req, res = response) => {
	//?  extraigo la informacion  que viene de body que se hace por medio de la peticon request.  Y lo validaremos para que no mande solo estas dos valores: nombre y edad.

	const { nombre, edad } = req.body;

	res.json({
		ok: true,
		msg: 'ES UNA PETICION POST API -DESDE CONTROLLERS : lo que hace es registrar un  usuario  o lo que sea',
		nombre,
		edad,
	});
};

const usuariosPUT = (req, res) => {
	//* Aqui crearems una constnte la cual guardaremos el parametro de segmento, que hemos llamdo "id"; que se le  asigna, para modificar el usuario. Y si hay mas de un params de segmentos lo haemos  desustrurando ya que viene de una popiedad llamada reques.
	const { id } = req.params;

	res.json({
		ok: true,
		msg: 'ES UNA PETICION PUT API-DESDE CONTROLLERS: Actualiza un usuruio o lo que sea',
		id,
	});
};

const usuariosDelete = (re, res) => {
	res.json({
		msg: 'ES UNA PETICION PATCH api-DELETE DESDE CONTTROLLERS: Busca unusoario o lo que sea de la data',
	});
};

const usuariosPatch = (re, res) => {
	res.json({
		msg: 'ES UNA PETICION PATCH api-PATCH DEsDE CONTROLLERS: Busca unusoario o lo que sea de la data',
	});
};

module.exports = {
	//? creamos un objeto para hacer las exporaciones
	usuariosGet,
	usuariosPOST,
	usuariosPUT,
	usuariosDelete,
	usuariosPatch,
};
