//? En la seccion de controlador en este archivo llamado categorias.js crearemos las funciones  con la que manejaremos  a cada na de las rutas  indicandoles que debe hacer. o informar.

const { request, response } = require('express');
const { Categoria, Usuario } = require('../models/index');
const usuario = require('../models/usuario');
//const usuario = require('../models/usuario');

//TODO: 1.-? Creando las categorias: obtenerCategorias ,  debe de estar paginado, mostrar el total y hacer el populate para mostrar quien la creo .

const obtenerCategorias = async (req, res = response) => {
	//? Desectruraremos la informacion que necesto, que viene del query
	//! En la peticon "que viene con la url "y estas  solicitudes  llamadas query,  se piden; de la siguiente manera:

	//*capturems la cantidad de categorias que se solicito en la url
	const { limite = 5, desde = 0 } = req.query;

	//! NOTA: puedo crear un objeto:  que lo llamaremos query que contendra el estado de la categoria

	//****

	const query = { estado: true };

	//*

	//? PARA que mande el total de regitros validos es decir su estado debe esta en true, ya que no se eliminaraan de la DB
	//	.skip(Number(desde)) //* Para decir que se empiece a mostrar desde de usuario siguiente: ejemplo desde=4 Emepzara am mostrar desde el usurio 6 hasta completar 5; que son por defecto o lo que se indique.
	//	.limit(Number(limite)); //todo Si quire que salga un cantidad definida de categoria solicitado en el url debo escribir limit= "colocamos el numero". NOTA: En la linea 28 al finalizar find() le doy a la tecla enter y en la siguiente linea escribo .limite (Number(limite));

	//const total = await Categoria.countDocuments(query); //? PARA que mande el total de regitros validos es decir su estado debe esta en true ;ya que no se eliminaraan de la DB

	//todo:Ahora.- Mandemos en la url (el query)  la cantidad de registro que apazcan en patalla

	//todo. Para Obtimizar las repuestas y no esperando que cada uno de los await me de la respuesta. debo hacer los siguiente para que ambas promesas se aciven simultaneamente.

	//Hacmos el siguiente código
	const [total, categorias] = await Promise.all([
		//* com el metodo CountDocuments(), obtengo el total de categorias.
		//?*Obtengamos todo las categoria con Categoria.find(query) que este en true,  guardado en un variable que llamamos query.
		//*Con el metodo populate() le digo que obtenga de DB el nombre del ususrio que lo creo.
		//* Con el metodo skip la le digo desde done empiezo a paginar.
		//* Con metodo limit le digo cuantas categorias debo mostrar
		Categoria.countDocuments(query),

		Categoria.find(query)
			.populate('usuario', 'nombre')
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		//? Mostremos  como un objetos
		total,
		categorias,
	});
	//*Solo para msotrarlo por el terminal, para saber que esta bien
	console.log({ total, categorias });
};

//?Fin de obtenerCategorias

//TODO: 2.-? Creando  la categoria de : obtenerCategoria,
const obtenerCategoria = async (req = request, res = response) => {
	//Obtener el id   que viene en los parametros de la request
	const { id } = req.params;

	//Buscamos la categoria en la base mongoAtlas y  tambien el espicicamos quien la creo con la instuccion populate

	const categoria = await Categoria.findById(id).populate('usuario', ' nombre');

	//MAndamos la respuesta con un json
	res.json(categoria);

	//Lsto recuerde exportarlo

	//ahora vamos a la ruta para colocar los controles ocn los middelware.

	//Confirmamos que exita es categroia
};

//?Fin de obtenerCategoria

//TODO: 3.- ? Creando la Categoria de : creaCategoria
const creaCategoria = async (req, res = response) => {
	//? Debo extrar la categoria del producto que viene en el body y pasarlo a mayuscula lo que se escribio como categoria.

	const nombre = req.body.nombre.toUpperCase(); //extragimos la categoria que viene del body y la convetimos a mayuscula.

	//*Veamos si existe un acotegoria en la base de datos con ese nombre y la guardamos en la variable llamada categoriaDB
	const categoriaDB = await Categoria.findOne({ nombre });

	//*Si  categoriaDB contiene un nombre , quiere decir que existe y por lo tanto  mandamos un mensaje de errro diciendo que ya existe
	if (categoriaDB) {
		//Mando un mensaje y me salo del programa
		return res.status(400).json({
			msg: `La Categoria  ${categoriaDB.nombre},  ya existe`,
		});
	}

	//? como no exite ya que no paso poe el if, la creamos la data que queremos guardar para poder guardarla  en la mongoDB_Atlas.

	//generemsos la data ayudandon con el modelo que creamos para la Categoria

	const data = {
		nombre, //Nombre que va  llamarse la categoria
		usuario: req.usuario._id, //*usuario que me va a crear la Categoria  porque necito saber quien la creo y esta validado por el  JWG yque este en la base de Usuario de mongoDB.
	};

	console.log({ data });
	//*Creamos una nueva categoria
	const categoria = new Categoria(data);

	//*la Grabemos en la DB de mongo.
	await categoria.save();

	//?ya grabdo podemos mandarle la respuesta de que se creo la categoria.
	res.status(201).json(categoria);

	//listo
};
//? Fin de creaCategoria

//TODO: 4.- ? Creando la Categoria de : actualizarCategoria

const actualizarCategoria = async (req = request, res = response) => {
	const { id } = req.params; //Obtenemos el id de la categoria que viene del url

	//*Quiero que no tome ni el usuario; porque alguien quiere saber que nuestro backquen esta correcatmente validado, ni  el estado  debe ser mdificado por este medio. las debo excluir de body cuando capturamos datos del body, lo demas que lame data que los tome para utlizarlos en la actualizacion.

	const { estado, usuario, ...data } = req.body;

	//*Debo grabar el nombre de la categoria y debo de hacerlo en mayuscula todo el nombre que vien de la data para la actualizacion. Ojo mo imprta que la instrucción de la linea 128 sea una constante  ya que  no esto cambiando la proiedad nombre , ya que estoy cambiando el nombre de la  categoria (VALOR DE ESA PROPIEDAD) que será guardada en esa propiedad: data.nombre

	data.nombre = data.nombre.toUpperCase();

	//* Establecemos el usuario que hizo la ultima modificaciom de esta categoria
	data.usuario = req.usuario._id; //*_id del usuario dueño del token para actualizar la categoria

	const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }); //* Está actualizando la categoria utilzndo  su id , con la data de actulizacion y la instruccion: {new: true} para que mande el nuevo documento actualizado.

	//*mandamos la informacion  en el json que se aactulizo

	res.json(categoria);
};

//?Fin de actualizarCategoria

//TODO:Fin de actualir cotegoria

//TODO: Creando la categoria de :Eliminar categoria

const borrarCategoria = async (req = request, res = response) => {
	//Obtener el id de la categoria que viene en el parametro
	const { id } = req.params;
	//No se utilizara la funcion findByIdAndDelete porque no quiero borrar la categoria  de la base de datos
	const categoriaBorrada = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }, //Para que muestre los nuevo valores
	);

	res.json({
		categoriaBorrada,
	});
};

//?FIn de eliminar Categoria
module.exports = {
	creaCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borrarCategoria,
};
