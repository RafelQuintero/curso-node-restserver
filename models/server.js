//! Estamos creando una clase llamadaa server para que sea mas limpio  mi app.js
//todo: requerimos las siguiente aplicaciones (librerias) para utilizarlas
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
	//creamos los  atributos direcatmente en la en el constructor, asi como los metodos

	constructor() {
		this.app = express();

		this.port = process.env.PORT;
		this.routesPatch = '/api/usuarios'; //?Para que sepa cualquier otro  que estas son las rutas que utiliza un usuario

		//*Hacemos la conexion con la base de datos justo cunado hagamos la lla maada

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
		//! Creano los middlware
		//? usemos cors para interactuar con la web usando   middleware
		this.app.use(cors());

		//* Usamos un middelware para poder recibir de cuerpo de body  una peticion del tipo json.
		this.app.use(express.json());

		//?Estamos usando un middelware  para que se use la carpeta  public como primera opción.

		this.app.use(express.static('public'));
	}

	//todo: definamos las rutas por medio de un metodo que haremos llamado routes
	//todo: Donde las respuesta es  es del tipo json la cual esta conformada por por objetos

	routes() {
		this.app.use(this.routesPatch, require('../routes/usuarios'));
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
