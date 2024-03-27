//?En este archivo  usuarios.js ,  crearemos funciones y la exportaremos
//! Obtenemos la funncion reponse de  del paquete express para que cuando hagamos la solicitud res.cuaquier cusa, aprarezca la ayuda.
const { request, response } = require('express');

//todo:5.-  solicitiemos nuestro modelo creado para que lo utilce mongoose y demoste un nombre como Usuario Y es con mayuscula para permiteir crear instancias de mi modelo.Esto es una regla de programacion.

const bcryptjs = require('bcryptjs'); //! requeimos en modulo para la encripatciom prevoamente instalado

const Usuario = require('../models/usuario.js');

const usuariosGet = async (req = request, res = response) => {
	//? Desectruraremso la informacion que necesto, que viene del query
	//! En la peticon "que viene con la url "y estas  solicitudes  llamadas query,  se piden; de la siguiente manera:
	//todo:  comentemos las lines 15 hasta 21
	//?const {
	//?	q = 'no date',
	//*  Aparece esta informacion, si no se le manda la informacion en la url (ejemplo: http:////?localhost:8080/api/usuarios?q=PEPE&nombre=FERNANDO&apikey=12345) cuando se hace la peticion
	//?	nombre = 'no name', //*La misma documentacion que la anterior
	//?	page = 1, //*La misma documentacion que la anterior
	//?	list = 20, //*La misma documentacion que la anterior
	//?} = req.query;

	//TODO: paso 1.- Hagamos el Get para solicitar todos los usuarios registrados  y mostrarlos dcon un json

	//capturma la cantidad de usarios que se solicito en la url
	const { limite = 5, desde = 0 } = req.query;

	//! NOTA: puedo crear un objeto: const query ={estado : true} La cual sustituirá el argumeto {estado : true} por query; como: fin(query) y countDocuments(query)

	//****

	const query = { estado: true };

	//* */

	//const usuriosRegistrados = await Usuario.find(query) //? PARA que mande el total de regitros validos es decir su estado debe esta en true, ya que no se eliminaraan de la DB
	//	.skip(Number(desde)) //* Para decir que se empiece a mostrar desde de usuario siguiente: ejemplo desde=4 Emepzara am mostrar desde el usurio 6 hasta completar 5; que son por defecto o lo que se indique.
	//	.limit(Number(limite)); //todo Si quire que salga un cantidad definida de usurios solicitado en el url debo escribir ?limit= colocamos el numero. NOTA: En la linea 28 al finalizar fin() le doy a la tecla enter y en la siguiente linea escribo .limite (Number(limite));

	//const total = await Usuario.countDocuments(query); //? PARA que mande el total de regitros validos es decir su estado debe esta en true ;ya que no se eliminaraan de la DB

	//todo:Ahora.- Mandemos en la url (el query)  la cantidad de registro que apazcan en patalla

	//todo. Para Obtimizar las repuestas y no esperando que cada unode los await me de la respuesta. debo hacer los siguiente para que ambas promesas se aciven simultaneamente.
	//todo: Borramos las lineas 36 y la 40
	//Hacmos el siguiente código
	const [total, usuriosRegistrados] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({
		//? ok: true,
		//? Eliminammos las lineas  27 hasta el 34 que nustran en el  mensaje json cuando en enviado en la  peticon de la url (req.query).
		//* msg: 'ES UNA PETICION   GET API-  DESDE EL CONTROLADOR : La cual muestra todo lo registros de  una //* colección ',
		//* q,
		//* nombre,
		//* apikey,
		//* page,
		//* list,
		//? Mostremos  como un objetos
		total,
		usuriosRegistrados,
	});
};

//* debo convertir mi funcion flecha , en un funcion asycrona para poder  utilizar el await para que pueda guardar los datos en mongodb

const usuariosPOST = async (req, res = response) => {
	//?1.-   extraigo la informacion  que viene de body que se hace por medio de la peticon request.  Y lo validaremos para que  mande solo estas dos valores: nombre y edad.
	//*2.- Si utilizo como constante una variable llamda body y reflejo todo lo que viene de body de la siguiente manera :  const body =req.body
	//?3.-  En res.json  coloco   body para capturar todas la peticiones hechas por el body cuando ejecuto postman,
	//! 4.- Utlicemos nuestro modelo de mongoose para hacer la peticon al body.
	//*5.-  body, no da error pero no me lo está  guardando en la base de datos de mongoose. pero si creo la coleccion (tabla)  y la llamo usuarios. ojo lo puso en plural por lo que debemos mandarlo a guardar con el metodo save () de mongoose.
	//? 6.-  creamos un instancio por medio de un varible para que tome todos los datos de esa clase  modelo que creamos para monggose y la llamremos usuario.
	//? 7.- Guardamos todo los datos del modelo para que lo almcene en la coleccion llamada usurios en mongoose.
	//todo:8.-  Colocemos  la instancia  del modelo de mongoose, que se guardo en una variable llamada usuario la cual la colocaremos dentro de res.json para que la mustre sy todo sale bien.
	//* 9.- si solo quermos guardar cietos valores del modelo modelo hacemos la desctruracion; en este caso : nombre,correo, password, rol. tomados del body.
	//! 10.- se elimino dentro del res.json la siguien:
	//!-------------
	//*ok: true,
	//*msg: 'ES UNA PETICION POST API //*-DESDE CONTROLLERS : lo que //*hace es registrar un  usuario  //*o lo que sea',
	//*nombre, era para hacer puebas que si fucninaba
	//* edad, era para hacer prubas que si funcionaba  ya que solo se utilizo para ver si funcionaba bien
	//!-------------------fin de comentario
	//* Si existen muchos campos en la creacion de un usuario ,solo tomaremos los obligatorio como se escribo abajo

	//? corte la informacion que estaba aqui y la coloqué donde se creo la funcion validarCampo() que esta en el '../middelware/valida-campo.js'

	const { nombre, correo, password, rol } = req.body;

	//const body = req.body;

	const usuario = new Usuario({ nombre, correo, password, rol });

	//* Validemos el cooreo para que no existan duplicidad; //PERO LA MOVIMOS PAR EL ARCHIVO DB-VAIDATOR.JS QUE ESTS EL A CARPETA HELPERS -------------

	//*----------------------
	//*? Encriptemos la contraseña antes de que exista el correo y existe  no lo hago apar que.

	const salt = bcryptjs.genSaltSync();
	//?Generamos la contraseña tomando el password de la preticones hechas en el body que es obligatorio en el modelo creado para mongoose

	//! Guardamos la nueva contraseña generada por bcryptjs

	usuario.password = bcryptjs.hashSync(password, salt);

	await usuario.save();

	res.json({
		usuario,
	});
};

const usuariosPUT = async (req, res) => {
	//* Aqui crearems una constnte la cual guardaremos el parametro de segmento, que hemos llamdo "id"; que se le  asigna, para  el usuario. Y si hay mas de un params de segmentos lo haemos  desustrurando ya que viene de una popiedad llamada reques.
	const { id } = req.params;

	const { _id, password, google, correo, ...resto } = req.body; //* Voy a desectructurar todo lo que no necesito que se grave o lo que necesito  modificar, cuando se hace la peticon (req) que viene del body
	//* en la desectruracion coloco _id para que no lo tome encuenta al madar a aculizar si alguien se le ocurre mandarlo en el cuerpo del body de request.

	//todo:  si tenogo que validar password contra la base de datos.
	if (password) {
		//todo;  Si viene el password, significa que desea actualizar la contraseña.
		const salt = bcryptjs.genSaltSync(); //todo: Generamos un numero aelatorio
		resto.password = bcryptjs.hashSync(password, salt); //todo: Actualicemos la contraseña
	}
	const usuario = await Usuario.findByIdAndUpdate(id, resto); //? Actualizamos   el usuario que contiene ese "id" y la actulizacion se  para lo que viene en el resto.

	res.json({
		msg: 'Usuario actualizado',
		usuario,
	});
};

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	//? extraigo el uid que esta en la req.uid
	//?const uid = req.uid; para mostrarlo, que es el uid que conteiene el token valido

	//* Boramos fisicamente el usuario de la bas de datos (en la colccion de mngoDB Atlas ) pero lo dejaremos el codigo de manera de cometario como dicactico,---------

	//?const usuario = await Usuario.findByIdAndDelete(id);

	//*fim de borrado fisicamente------

	//* Ahora lo borramo pero que no se ilimine de la DB de MongodDB atlas-----

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

	//?De ddonde obtengo el usuario autenticado , lo obtengo de la req.usuario

	//?const usuarioautenticado = req.usuario; lo elimino para que no se muestre ya que lo utilzamos para saber queera el usuario tenricado que es el que tien el uid del token

	res.json({
		usuario,

		//* uid, eliminamos para que no se muestre era ya que que demostramos queexiste este uid de usuario que tiene el toquen

		//*usuarioautenticado,  lo elimino para que no se muestre ya que lo utilzamos para saber queera el usirio tenricado que es el que tien el uid del token
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
