//!Requerimos el modulo de mongoose
const mongoose = require('mongoose');
//*require('dotenv').config(); no necesito esta intruccion ya que se imboco en la app.js que es el archiv principal

const dbConnection = async () => {
	try {
		//? Aqui vamos a  invocar la conexion de la base de datos recordadndo que debuelve uan pormesa, pero como estoy en un try- catch debo colocatar en un await en vez de then ........En los parapetros de connect debo colocar el url para conectarme con la base de datos y ciertos parametros

		await mongoose.connect(process.env.URI_MONGODBATLAS, {
			//? Objetos que se pide en moongoose para que no tomo encuenta errores , pero son obsoleto en esta version de nodejs por lo que los voy a eliminar
			//*useNewUrlParser: true,
			//*useUnifiedTopology: true,
			//? Los dos de abajo al colocarlo dá errores al compilar y no hace conexion con a base de datos
			//!useCreateIndex: true,
			//!useFindAndModify: false,
		});
		//*Vemos en consola que estamos conectado con la base de datos....
		console.log('Base de datos online');
	} catch (error) {
		//* Veamos en consola el error que se esta disparando
		console.log(error);
		throw new Error('Error al iniciar la base de datos');
	}
};

module.exports = {
	dbConnection,
};
