const { response, request } = require('express');
//* Obtenemos  el Objectid se lo Type de mongoose
const { ObjectId } = require('mongoose').Types;

//* Importemos el modelo que son: Usuario, Categoria, Producto
const { Usuario, Categoria, Producto } = require('../models');
const { $where } = require('../models/categoria');
const categoria = require('../models/categoria');

//* crearemos un array de objetos las cuales tendremos las colecciones a buscar
const colecccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

//* Crearemos la busqueda de usuarios

//? Creo la funcion de buscarUsuarios
const buscarUsuarios = async (termino = ' ', res = response) => {
	//! El termino se refiere a un id de mongo

	const esMongoID = ObjectId.isValid(termino); //* Si es un id de mongo devolvera un true de lo contrario un false

	if (esMongoID) {
		//* como es un id de mongo ya que me devolvio un tru buscamos este usurario

		const usuario = await Usuario.findById(termino); //* Recurede que  termino es el id de mongo

		//* Que queremos   mis respuestas (busquedas) todas funcionen iguales y  que me retorne una respuesta.

		return res.json({
			//No colocare el usuario como respuesta , si colocare un objeto en el cual colocare el results (resultados) para que respeusta  usuario se vea  como un array de objetos. poro lo decalrare el if con un  tenario para que no exista un null, (que significa _"que es un id de momgo , pero no existe en ningun usuario valido"), y si no lo es lo regresamos como un arreglo vacio  " [] ".
			results: usuario ? [usuario] : [], //? Si el usuario existe retorno el usuario con un arreglo (array) pero si no existe que me retorne un arrgle vacio.
		});
	}
	//* crearemos una exprsion regular "regex";  que sea insencible a lo que se escribe en  el argumento llamado termino que viene en los parametros, ya que estamos busando la informacion por el termino. ya sea el nombre del usuaro o el corroe de este.
	const regex = new RegExp(termino, 'i'); //? RegExp() ya viene en javascrip por lo que no necesito importar nada.  la letra "i" significa que sea insensible a la letras mauosculas o minusculas
	//*obtemgamos los uusarios
	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }], //? $or son propia de mongo y es una condicio OR
		$and: [{ estado: true }], //?$and son propia de mongo y es una condicon AND

		//* Si utilizo la funcion count en vez de find obtengo la cantidad de usuarios o correos  que tiene regex
	});

	res.json({
		results: usuarios,
	});
};

//***********         fin de bucarUsuario */

//*//* Crearemos la busqueda de categorias
//? Creo la funcion de buscarCategorias
const buscarCaregorias = async (termino = ' ', res = response) => {
	const esMongoID = ObjectId.isValid(termino); //* Si es un id de mongo devolvera un true de lo contrario un false

	if (esMongoID) {
		//* como es un id de mongo ya que me devolvio un tru buscamos este categoria

		const categoria = await Categoria.findById(termino); //* Recurede que  termino es el id de mongo

		//* Que queremos   mis respuestas (busquedas) todas funcionen iguales y  que me retorne una respuesta.

		return res.json({
			//No colocare la categoria como respuesta , si colocare un objeto en el cual colocare el results (resultados) para que la respeusta categria se vea  como un array de objetos. pero decalro el if con un  tenario para que no exista un null, (que significa _"que es un id de momgo , pero no existe en ningun usuario valido"), y si no lo es lo regresamos como un arreglo vacio  " [] ".
			results: categoria ? [categoria] : [],
		});
	}
	const regex = new RegExp(termino, 'i');

	const categorias = await Categoria.find({
		nombre: regex,
		estado: true,
	});

	//* Si utilizo la funcion count en vez de find,  obtengo  la cantidad total de  categorias

	res.json({
		results: categorias,
	});
};

//************Fin de buscarCategoria */

//* Crearemos la busqueda de productos

//? Creo la funcion de buscarProductos
const buscarProductos = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino); //* Si es un id de mongo devolvera un true de lo contrario un false

	if (esMongoID) {
		//* como es un id de mongo ya que me devolvio un tru buscamos este categoria

		const producto = await Producto.findById(termino)
			.populate('categoria', 'nombre')
			.populate('usuario', 'nombre');
		//* Recurede que  termino es el id de mongo

		//* Que queremos ? que  mis respuestas (busquedas) todas funcionen iguales y  que me retorne una respuesta.

		return res.json({
			/*No colocare el producto como respuesta , Presentare el producto como  un objeto en el cual ira el results (resultados) para que la respeusta se vea  como un array de objetos.  Y  declarare el if  utilizando un   tenario y si no existe un producto lo declaro como un array vacio " [] "en vez de un null (que significa _"que es un id de momgo , pero no existe en ningun producto con ese id valido de mongo").*/
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const productos = await Producto.find({
		nombre: regex, //? $or son propia de mongo y es una condicio OR
		estado: true, //?$and son propia de mongo y es una condicon AND

		//* Si utilizo la funcion count en vez de find obtego la cantidad de usuario o correo  que tiene reges
	})
		.populate('categoria', 'nombre')
		.populate('usuario', 'nombre');

	res.json({
		results: productos,
	});
};

//*******Fin de buscarProductos***** */

const buscar = (req = request, res = response) => {
	//*Lo  hacemos explicito le req y el res para que me facilite la ayuda
	const { coleccion, termino } = req.params; //?desestrucutramos lo que viene del params. Si  es una coleccionPermitidas: que esta en la coleccion y el termino si es un id de mongoatlas

	//* Usemos lo anterior para validad si la coleccion a buscar esta en el array de colecccionesPermitidas
	if (!colecccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `La colecciones permitidad son: ${colecccionesPermitidas}`,
		});
	}

	//*Haremos un swich para ver que coleccion  se seleccionó siempre  y cuando no entre al if anterior.

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);

			break;
		case 'categorias':
			buscarCaregorias(termino, res);
			break;

		case 'productos':
			buscarProductos(termino, res);
			break;

		default:
			res.status(500).json({
				msg: ' Se me olvido hacer esta buqueda',
			});
			break;
	}
};

//*Exportemos el cntrolador
module.exports = {
	//* Lo exportamos como un objeto por si acaso ncesitamos exportar  otros controlares de busqueda.
	buscar,
};
//Ahora haremos la busqueda en la propia base
