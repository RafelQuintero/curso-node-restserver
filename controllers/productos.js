//? En la seccion de controlador en este archivo llamado productos.js crearemos las funciones  con la que manejaremos  a cada una de las rutas  indicandoles que debe hacer. o informar.

const { request, response } = require('express');
const { Producto } = require('../models/index');
const { populate } = require('../models/categoria');

//TODO: 1.-? Creando los productos: obtenerProductos ,  debe de estar paginado, mostrar el total y hacer el populate para mostrar quien la creo .

const obtenerProductos = async (req, res = response) => {
	//? Desectruraremos la informacion que necesto, que viene del query
	//! En la peticon "que viene con la url "y estas  solicitudes  llamadas query,  se piden; de la siguiente manera:

	//*capturemos la cantidad de productos que se solicito en la url
	const { limite = 5, desde = 0 } = req.query;

	//! NOTA: puedo crear un objeto:  que lo llamaremos query que contendra el estado de la categoria

	//****

	const query = { estado: true };
	//? PARA que mande el total de regitros validos; es decir su estado debe esta en true, ya que no se eliminaraan de la DB

	//*

	//	.skip(Number(desde)) //* Para decir que se empiece a mostrar desde de usuario siguiente: ejemplo desde=4 Emepzara am mostrar desde el usurio 6 hasta completar 5; que son por defecto o lo que se indique.
	//	.limit(Number(limite)); //todo Si quire que salga un cantidad definida de categoria solicitado en el url debo escribir limit= "colocamos el numero". NOTA: En la linea 28 al finalizar find() le doy a la tecla enter y en la siguiente linea escribo .limite (Number(limite));

	//const total = await Producto.countDocuments(query); //? PARA que mande el total de regitros validos es decir su estado debe esta en true ;ya que no se eliminaraan de la DB

	//todo:Ahora.- Mandemos en la url (el query)  la cantidad de registro que apazcan en patalla

	//todo. Para Obtimizar las repuestas y no esperando que cada uno de los await me de la respuesta. debo hacer los siguiente para que ambas promesas se aciven simultaneamente.

	//Hacmos el siguiente código
	const [total, productos] = await Promise.all([
		//* com el metodo CountDocuments(), obtengo el total de productos.
		//?*Obtengamos todo los productos con Producto.find(query) que este en true,  guardado en un variable que llamamos query.
		//*Con el metodo populate() le digo que obtenga de DB el nombre del ususrio que lo creo.
		//* Con el metodo skip la le digo desde done empiezo a paginar.
		//* Con metodo limit le digo cuantas productos debo mostrar
		Producto.countDocuments(query),

		Producto.find(query)
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre')
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		//? Mostremos  como un objetos
		total,
		productos,
	});
	//*Solo para msotrarlo por el terminal, para saber que esta bien
	console.log({ total, productos });
};

//?Fin de obtenerCategorias

//TODO: 2.-? Creando  la categoria de : obtenerProducto,
const obtenerProducto = async (req = request, res = response) => {
	//Obtener el id   que viene en los parametros de la request
	const { id } = req.params;

	//Buscamos la categoria en la base mongoAtlas y  tambien el espicicamos quien la creo con la instuccion populate

	const producto = await Producto.findById(id)
		.populate('usuario', 'nombre') //Obtenemos el nombre del usuario que creo el producto.
		.populate('categoria', 'nombre'); //Obtenemos el nombre de la categoria .

	//Mandamos la respuesta con un json
	res.json(producto);

	//Lsto recuerde exportarlo

	//ahora vamos a la ruta para colocar los controles ocn los middelware.

	//Confirmamos que exita es categroia
};

//?Fin de obtenerProducto

//TODO: 3.- ? Creando la Categoria de : crearProducto
const crearProducto = async (req, res = response) => {
	//? debo excluir del  body  el estado yq que noquiro que lo cambien y el usuario si lo mandan debo ignorarlo ; lo demas que venga de body si se capturo
	const { estado, usuario, ...body } = req.body;

	//? Debo extrar el producto que viene en el body y pasarlo a mayuscula lo que se escribio como categoria.

	const nombre = req.body.nombre.toUpperCase(); //extragimos la categoria que viene del body y la convetimos a mayuscula.

	//*Veamos si existe un producto en la base de datos con ese nombre y la guardamos en la variable llamada categoriaDB
	const productoDB = await Producto.findOne({ nombre });

	//*Si  productoaDB contiene un nombre , quiere decir que existe y por lo tanto  mandamos un mensaje de errro diciendo que ya existe
	if (productoDB) {
		//Mando un mensaje y me salo del programa
		return res.status(400).json({
			msg: `El producto  ${productoDB.nombre},  ya existe`,
		});
	}

	//? como no exite ya que no paso poe el if, la creamos la data que queremos guardar para poder guardarla  en la mongoDB_Atlas.

	//generemsos la data ayudandon con el modelo que creamos para El Producto

	const data = {
		...body, //* Que la data contenga todo lo del body, menos lo que fue exclido de este.
		nombre: body.nombre.toUpperCase(), //Nombre que va  llamarse El producto
		usuario: req.usuario._id, //*usuario que me va a crear El producto,  porque necito saber quien la creo y esta validado por el  JWG yque este en la base de Usuario de mongoDB.
	};

	console.log({ data });
	//*Creamos una nueva categoria
	const producto = new Producto(data);

	//*la Grabemos en la DB de mongo utilzamdo el await por el tiempo de espara que se garbe.
	await producto.save();

	//?ya grabdo podemos mandarle la respuesta de que se creo el producto.
	res.status(201).json(producto);

	//listo
};
//? Fin de crearProducto

//TODO: 4.- ? Creando el Producto de : actualizarProducto

const actualizarProducto = async (req = request, res = response) => {
	const { id } = req.params; //Obtenemos el id de el producto que viene del url

	//*Quiero que no tome ni el usuario; porque alguien quiere saber que nuestro backquen esta correcatmente validado (no lodejo que se edite ), ni  el estado para que no sea modificado  por este medio. las debo excluir de body cuando capturamos datos del body, lo demas que lame data que los tome para utlizarlos en la actualizacion.

	const { estado, usuario, ...data } = req.body;

	//*Debo grabar el nombre de la categoria y debo de hacerlo en mayuscula todo el nombre que vien de la data para la actualizacion. Ojo mo imprta que la instrucción de la linea 128 sea una constante  ya que  no esto cambiando la proiedad nombre , ya que estoy cambiando el nombre de la  categoria (VALOR DE ESA PROPIEDAD) que será guardada en esa propiedad: data.nombre

	//* Consultemos si viene el nombre de lo contrario no lo acualizamos
	if (data.nombre) {
		data.nombre = data.nombre.toUpperCase();
	}

	//* Establecemos el usuario que hizo la ultima modificaciom de esta categoria
	data.usuario = req.usuario._id; //*_id del usuario dueño del token para actualizar la categoria

	const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); //* Está actualizando el producot utilzando  su id , con la data de actulizacion y la instruccion: {new: true} para que mande el nuevo documento actualizado.

	//*mandamos la informacion  en el json que se aactulizo

	res.json(producto);
};

//?Fin de actualizarProducto

//TODO: Creando el producto de :Eliminar producto

const borrarProducto = async (req = request, res = response) => {
	//Obtener el id de la categoria que viene en el parametro
	const { id } = req.params;
	//No se utilizara la funcion findByIdAndDelete porque no quiero borrar la categoria  de la base de datos
	const productoBorrado = await Producto.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }, //Para que muestre los nuevo valores
	);

	res.json({
		productoBorrado,
	});
};

//?FIn de eliminar Producto
module.exports = {
	crearProducto,
	obtenerProducto,
	obtenerProductos,
	actualizarProducto,
	borrarProducto,
};
