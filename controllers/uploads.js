const path = require('path');
const fs = require('fs');
//npn para guardar fotos y videos
const cloudinary = require('cloudinary').v2;
//?Configuramos la cuenta de cloudinary par que el sepa que usuario la está utilizando

cloudinary.config(process.env.CLOUDINARY_URL);
//?fin de la condiguracion

const { request, response } = require('express'); // SoLicito  de express la request y le response, para que men ayude en el tipiado,
const { subirArchivo } = require('../helpers');
//todo: Importemos el modelo de Usuario y  el de Producto de la carpeta (folder) modelo; como tengo un indix.js no necesto llamar el archivo.js especifico
const { Usuario, Producto } = require('../models');
const { model } = require('mongoose');
const { constants } = require('crypto');
const { log } = require('console');

const cargarArchivo = async (req, res = response) => {
	/*  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		res.status(400).json({ msg: 'No hay archivo que subir' });
		return;




    };
	 */

	try {
		//Utilizare las imagenes  que viene por defocto, por eso no colocolos atro argumeto en la funcion subirArchvo()  ya la ruta por defecto es uploads.js
		//const pathCompleto = await subirArchivo(req.files, ['txt', 'md'], 'textos');
		//  Hicimos comentario de la linea 12. Ahora quiero que todas las imagenes se uarden en un acrpeta llamada "imgs" esta sera sustituido por "textos". doonde estaba el arry cocloc undefined para que sea por defecto las extensiones que se colocaron.

		const pathCompleto = await subirArchivo(req.files, undefined, 'imgs'); // En el segundo argumento colocaremos las extesiones que quremos a apare de las que estan por defecto, se puede hacer dentro del prametro ey array de extensiones permiitidas, o la declaramos en una variable y esta  será el segunda argumento.
		// Si querenos guardar  un archivo en una carpeta en particular, por ejemplo "textos"  y si no  existe la crea, esto se colocara como 4to argumento de la funcion subirArchivo() . Esto se hace agregando en el archivos server.js donde esta el middelware "fileUpload()"la instruccion  "createParentPath: true".
		res.json({
			nombre: pathCompleto, //estoy recibiendo  solo el nombre del archivo.
		});
	} catch (msg) {
		res.status(400).json({ msg });
		console.log({ msg });
	}
};

//?SE creara la funcion actualizarImagen que indica  en que   coleccion le voy  agregarle un imagen, haciendo por medio de id indicado  y la coleccion que neceitare ara guardar la imagen. Recuerde que en el modelo de mi coleccion solo necesito del modelo el paramtro "img".

const actualizarImagen = async (req = request, res = response) => {
	/* if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res.status(400).json({ msg: 'No hay archivo que subir' });
	} */
	//TODO:  COMO EL CÓDIGO DE LA LINEA 31 AL 33 DE REPITE EN LAS LINEAS 7 AL 10 LAS ELIMINAREMOS Y SERA SUSTITUIDO POR UN MIDDWARE , QUE ESTARÁ EN LA CARPETA DE LOS MIDDELWARE QUE SERA  CREADO EN LA CARPETA DE ESTOS  Y COLOCADO EN PUT  DE ACTUALIZACION DE LA COLECCION ;  POR LA QUE LAS ELIMNIMOS COLOCANDOLAS COM COMENTARIO

	const { id, coleccion } = req.params; //se que necesecito esos dos parametsod orque fueron los que se especificadon en la ruta

	//Se creara un varible condicional llamada modelo porque esta sera modificada de acuerdo a la necesidad segun se quiera un usuario o un producto.

	let modelo;

	//?Ahoar haremos un swich para que seleccion el tipo de coleccion; ya sea un usuario o un producto
	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un usuario con el id ${id}` });
			}

			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un producto con el id ${id}` });
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esto' });
	}

	//* Haremos una limpieza de las imagenes si  las hay más de una para el mismo usuario o para el producto:como lo hacemos ; sabemso que en los productos o los usurios  contiene un propiedad lamada "img" para guardar las imagenes. hequeamos si viene la imagen si viene , pero no necerarimente exista el patch (la ruta) en el servidaor, puede que se halla borrado o que pase cualquier coso con el patch, pero tengo que verificar que ese archivo exista, el procedimeintoes es le siguiente para hacerlo.
	//*Y  lo haremos antes de subir el archivo haremos la limpieza previa.
	//? limpiar imagenes previa y lo haremos antes de subir la ultima imangen.

	try {
		//verificaremos que si el modelo tiene la propiedad "img" cuando se creo el schema del modelo usuarios y productos
		if (modelo.img) {
			//? si existe img  en el modelo , debemos  borrar  la o las  imagenes en el  servidor borrando todo el patch para llegar donde estan las imagen(es)   del servidor.
			//* Utilizamos el patch del servidor y lo vamos a construir llamadolo "patchImagen"
			//? COmo me encuentro dentro de la carpeata controllers y debo apuntar a la carpeta "upload" por lo que debo utilzar los dos puntos
			//*Necesito saber si estoy borrnado un producto o un usuario para eso debe mandar la coleeccom
			//? Ahora debo especificar el nombre de la imgan a borrar  y lo tengo en nuesto modelo "modelo.img"
			const patchImagen = path.join(
				__dirname,
				'../uploads',
				coleccion,
				modelo.img,
			);
			//* El la linea 87 se construyo el camino (patchImagen ) de donde estan las images,
			//* Pero deebesos verificar que esa ruta exista.chequeando que ese achivo exista u tiene esa ruta "patchImagen".
			if (fs.existsSync(patchImagen)) {
				//? Si exite el patchImagen, debemos borrarla, manddando el "patchImagen"
				fs.unlinkSync(patchImagen);
				// console.log({ BORRADO: patchImagen });
			}
		}
	} catch (msg) {
		res.status(400).json({ msg });
		//
	}

	//?FIn de imagenes previaas

	// Se recomienda colocar la informacion dentro de un try y un catch por si oucurre akgun error

	//* FIn de limpiar imagenes

	//? si todo sale bien ejecuta las instrucciones de abajo.
	/* res.json({
		id,
		coleccion,
		//estos son los datos que necesito mostar para ver si todo funciona bien 
	}); */
	//?fine de la instrucción de arriba
	//?procedimiento para guardar la imagen de una coleccion ya sea usuarios o  productos . pero eleminado las lineas 80 al 84  ya que las utilice para ver que estaba funcionado.

	const nombre = await subirArchivo(req.files, undefined, coleccion); //**gardaremos la imagen de un usuario o de un producto dentro de la carpeta que se creará llamada coleccion, pudiendo ser la coleccion, una carpeta usuarios o un carpeta productos  con la funcion de subirArchivo() */
	modelo.img = nombre; //**Se guardara  el nombre de la imagen en la propiedad llamada img del modelo Usuario o Producto   */
	await modelo.save(); //** Guardamos en bsae de datos el todos la carcteristicas de la coleccion ususrio o producto con su imagen anexada a este. */
	res.json({
		id,
		modelo,
	});
};

//? fin de actualizarImagen.

//?? Creando actualizarImagenCloudinary???

const actualizarImagenCloudinary = async (req = request, res = response) => {
	/* if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res.status(400).json({ msg: 'No hay archivo que subir' });
	} */
	//TODO:  COMO EL CÓDIGO DE LA LINEA 31 AL 33 DE REPITE EN LAS LINEAS 7 AL 10 LAS ELIMINAREMOS Y SERA SUSTITUIDO POR UN MIDDWARE , QUE ESTARÁ EN LA CARPETA DE LOS MIDDELWARE QUE SERA  CREADO EN LA CARPETA DE ESTOS  Y COLOCADO EN PUT  DE ACTUALIZACION DE LA COLECCION ;  POR LA QUE LAS ELIMNIMOS COLOCANDOLAS COM COMENTARIO

	const { id, coleccion } = req.params; //se que necesecito esos dos parametsod orque fueron los que se especificadon en la ruta

	//Se creara un varible condicional llamada modelo porque esta sera modificada de acuerdo a la necesidad segun se quiera un usuario o un producto.

	let modelo;

	//?Ahoar haremos un swich para que seleccion el tipo de coleccion; ya sea un usuario o un producto
	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un usuario con el id ${id}` });
			}

			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un producto con el id ${id}` });
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esto' });
	}

	//* Haremos una limpieza de las imagenes si  las hay más de una para el mismo usuario o para el producto:como lo hacemos ; sabemso que en los productos o los usurios  contiene un propiedad lamada "img" para guardar las imagenes. hequeamos si viene la imagen si viene , pero no necerarimente exista el patch (la ruta) en el servidaor, puede que se halla borrado o que pase cualquier coso con el patch, pero tengo que verificar que ese archivo exista, el procedimeintoes es le siguiente para hacerlo.
	//*Y  lo haremos antes de subir el archivo haremos la limpieza previa.
	//? limpiar imagenes previa y lo haremos antes de subir la ultima imangen.

	try {
		//verificaremos que si el modelo tiene la propiedad "img" cuando se creo el schema del modelo usuarios y productos
		if (modelo.img) {
			//* si nuuestro modelo ya existiera  una imagen , tambien tendrias que borrarlo de Cloudinary(Es un servidor donde alojare en este caso las inagenes), para que no se acumule basura.
			//? si existe img  en el modelo , debemos  borrar  la o las  imagenes en el  servidor cloudunary borrando  pero como Coudinary me crea un URL que contien toda  la ruta de la imagen a borrar https://res.cloudinary.com/dulznowmo/image/upload/v1727960609/tkvygytmhhgap4ys2j0c.png ; lo que necitaría solo en nombre que este servidor le dió  (tkvygytmhhgap4ys2j0c.png) , para borrar la imagen, por lo que debo hacer es cortar el url que es el patch y separarlo con instrucion split y voy a separarlo por el slap (/)+++++

			const nombreArr = modelo.img.split('/');
			//* Como necesito la ultima posicion lo hago asi;}:

			const nombre = nombreArr[nombreArr.length - 1];
			//*Ahora como tengo el nombre del archivo tkvygytmhhgap4ys2j0c.png y solo necesito la primera parte antes de punto lo vuelvo a separar con el método split()que mmegenera un arreglo.

			const [public_id] = nombre.split('.');

			// Ahora vemos en consolo que me da como resuatdo

			console.log(public_id);

			//*ahora boremos la imagen existente, utilizando un metodo propio de cloudinary

			await cloudinary.uploader.destroy(public_id);
		}
		//*Ahora lo subimos al Cluodinary
		// Previamente haré la instrucción de abajo  linea 193 para ver que  informacion tengo del objeto y de este, necesito un path  llamdo tempFilePath , qu es un atch temporal donde se tiene guardada la imagen.
		// console.log('mostrando data ddel objeto archivo');
		// console.log(req.files.archivo);
		//*Desestructuremo el objeto file.archivo que vine de la request.
		const { tempFilePath } = req.files.archivo;

		//? Como solo me interza de la respusta que se mustra en postman desctructuremos lo que  viene de : cloudinary.uploader.upload(tempFilePath)  que es: secure_url cambiando repuesta por la desectruracion
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
		modelo.img = secure_url;
		//*Guardamos la informacion que llego en modelo:
		await modelo.save();
		res.json({
			modelo,
			//respuesta,
			// 	id,
			//modelo,
		});
	} catch (msg) {
		res.status(400).json({ msg });
	}

	//?FIn de imagenes previaas

	// Se recomienda colocar la informacion dentro de un try y un catch por si oucurre akgun error

	//* FIn de limpiar imagenes

	//? si todo sale bien ejecuta las instrucciones de abajo.
	/* res.json({
		id,
		coleccion,
		//estos son los datos que necesito mostar para ver si todo funciona bien 
	}); */
	//?fine de la instrucción de arriba
	//?procedimiento para guardar la imagen de una coleccion ya sea usuarios o  productos . pero eleminado las lineas 80 al 84  ya que las utilice para ver que estaba funcionado.

	// const nombre = await subirArchivo(req.files, undefined, coleccion); //**gardaremos la imagen de un usuario o de un producto dentro de la carpeta que se creará llamada coleccion, pudiendo ser la coleccion, una carpeta usuarios o un carpeta productos  con la funcion de subirArchivo() */
	// modelo.img = nombre; //**Se guardara  el nombre de la imagen en la propiedad llamada img del modelo Usuario o Producto   */
	// await modelo.save(); //** Guardamos en bsae de datos el todos la carcteristicas de la coleccion ususrio o producto con su imagen anexada a este. */
};

///??Fin de actualizarimagencloudin??

//?Subir o Mostrar  imagen del servidor

const mostraImagen = async (req = request, res = response) => {
	const { id, coleccion } = req.params; //se que necesecito esos dos parametsod orque fueron los que se especificadon en la ruta

	//Se creara un varible condicional llamada modelo porque esta sera modificada de acuerdo a la necesidad segun se quiera un usuario o un producto.
	//********************* */
	let modelo;

	//?Ahoar haremos un swich para que seleccion el tipo de coleccion; ya sea un usuario o un producto
	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				//Deberia regresar una imagen que me  idicque  que no existe el usuario
				return res
					.status(400)
					.json({ msg: `No existe un usuario con el id ${id}` });
			}

			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un producto con el id ${id}` });
			}

			break;

		default:
			return res
				.status(500)
				.json({ msg: 'Se me olvido validar esto- mostrarImagen' });
	}

	//* Haremos una limpieza de las imagenes si  las hay más de una para el mismo usuario o para el producto:como lo hacemos ; sabemso que en los productos o los usurios  contiene un propiedad lamada "img" para guardar las imagenes. hequeamos si viene la imagen si viene , pero no necerarimente exista el patch (la ruta) en el servidaor, puede que se halla borrado o que pase cualquier coso con el patch, pero tengo que verificar que ese archivo exista, el procedimeintoes es le siguiente para hacerlo.
	//*Y  lo haremos antes de subir el archivo haremos la limpieza previa.
	//? limpiar imagenes previa y lo haremos antes de subir la ultima imangen.

	try {
		//verificaremos que si el modelo tiene la propiedad "img" cuando se creo el schema del modelo usuarios y productos
		if (modelo.img) {
			//!++++aqui debemos encargar de borrrar las imagens de clauduanry++++ //!

			//* Utilizamos el patch del servidor y lo vamos a construir llamadolo "patchImagen"
			//? COmo me encuentro dentro de la carpeata controllers y debo apuntar a la carpeta "upload" por lo que debo utilzar los dos puntos
			//*Necesito saber si estoy borrnado un producto o un usuario para eso debe mandar la coleeccom
			//? Ahora debo especificar el nombre de la imgan a borrar  y lo tengo en nuesto modelo "modelo.img"
			const patchImagen = path.join(
				__dirname,
				'../uploads',
				coleccion,
				modelo.img,
			);
			//* El la linea 87 se construyo el camino (patchImagen ) de donde estan las images,
			//* Pero deebesos verificar que esa ruta exista.chequeando que ese achivo exista u tiene esa ruta "patchImagen".
			if (fs.existsSync(patchImagen)) {
				//**necesito responder para subir la imagen de alguien  de la coleccion */
				return res.sendFile(patchImagen);
			}
		}
	} catch (msg) {
		res.status(400).json({ msg });
		//
	}
	//creamos el ccamino donde esta la imagen qeu me indique que no hay una imagen en la colección
	try {
		const patchPlaceHoder = path.join(__dirname, '../assets/no-image.jpg');
		console.log({ patchPlaceHoder });
		res.sendFile(patchPlaceHoder); //Enviamos la imagen
	} catch (msg) {
		res.status(400).json({ msg });
	}

	// res.json({ patchPlaceHoder });
	//************ */
	//* Veamos si funciona bien

	// res.json({
	// 	id,
	// 	coleccion,
	// });
	//**Se elimino las lineas 210 hasta 214 ya que eran ara probarlo el controlador */
};

//?  Fin Subir o Mostrar  imagen

module.exports = {
	cargarArchivo,
	actualizarImagen,
	mostraImagen,
	actualizarImagenCloudinary,
};
