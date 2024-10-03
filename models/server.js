//! Estamos creando una clase llamadaa server para que sea mas limpio  mi app.js
//todo: requerimos las siguiente aplicaciones (librerias) para utilizarlas
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { auth } = require('google-auth-library');

//TODO: Utilizamos el requerimiento de abajo para poder cargar los archivos
const fileUpload = require('express-fileupload');

class Server {
	//creamos los  atributos direcatmente en la en el constructor, asi como los metodos

	constructor() {
		this.app = express();

		this.port = process.env.PORT;
		//this.routesPatch = '/api/usuarios'; //?Para que sepa //cualquier otro  que estas son las rutas que utiliza un //usuario
		//this.authPath = '/api/auth'; //? Esta sera la ruta para la //autenticacion del usuario
		//
		//this.categoriaPath ="/api/categorias"//?Esta sera la ruta //de categorias

		//*Para optimizar las lineas 13, 14 15 y 17 crearemos referencia a una variable del tipo objeto, para obtener las rutas anteriores
		this.paths = {
			auth: '/api/auth',
			buscar: '/api/buscar', //TODO: Ahora la definimos masa abajo en la ruta
			categorias: '/api/categorias',
			productos: '/api/productos',
			usuarios: '/api/usuarios',
			//? Crearemos un nuevo paths (ruta)para manejar el url cargar el archivo

			uploads: '/api/uploads',
		};

		//*Hacemos la conexion con la base de datos justo cunado hagamos la llamaada

		this.conectarDB();

		//*crearemos  midelware, lo cual  debemos llamaremos

		this.middelwares();

		//* Debemos llamar a la rutas de mi aplicacion
		this.routes();
	}

	//TODO, Crearemos una funcion asucrona apara conectar con la base de datos

	async conectarDB() {
		await dbConnection();
	}

	//todo: Definimos el metodo para los middelwares

	middelwares() {
		//todo. tdo la que esta escrito aqui son middelware
		//! Creano los middlware
		//? usemos cors para interactuar con la web usando   middleware
		this.app.use(cors());

		//* Usamos un middelware para poder recibir de cuerpo de body  una peticion del tipo json.
		this.app.use(express.json());

		//?Estamos usando un middelware  para que se use la carpeta  public como primera opción.

		this.app.use(express.static('public'));

		//? el el midelware para manipular el: fileupload - Cargar Archivos
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true, // Esta comando  es  que si no tengo una carpeta ella me la crea para guardar los archios de un tipo que quiero
			}),
		);
	}

	//todo: definamos las rutas por medio de un metodo que haremos llamado routes
	//todo: Donde las respuesta es  es del tipo json la cual esta conformada por por objetos

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth')); //* Se creo la ruta para la autenticacion
		//* Se crea la ruata para buscar : categoria , productos, ususrio,etc.
		this.app.use(this.paths.buscar, require('../routes/buscar'));

		//* Aqui definimos la nueva ruta de categorias

		this.app.use(this.paths.categorias, require('../routes/categorias'));

		this.app.use(this.paths.productos, require('../routes/productos'));

		this.app.use(this.paths.usuarios, require('../routes/usuarios'));

		this.app.use(this.paths.uploads, require('../routes/uploads'));

		//******* */
	}

	//todo: Creaermos el metodo para que este escuhando o esperendo en el purto especificado ,
	//todo: lo cual llamaremos listen().

	listen() {
		this.app.listen(this.port, () => {
			console.log('EL SERVIDOR A LA ESPERA  EN EL PUERTO:', this.port);
		});
	}
}

module.exports = Server;
//Necesotare 5 servicos res para solicitar estos servicios.
