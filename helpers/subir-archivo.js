//Haremos la logica de subir archivos
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
	files = '',
	extensionesValidas = ['png', 'jpg', 'gif'],
	carpeta = '',
) => {
	//1.- Trabajaremos con el metodo de las promesas porque quireo saber cuando algo sale bien o sale mal. Si quisiera cancelar las promesas, se debe hace con extensiones reactivas.
	// por lo que haeremos un return dnew Promise()
	//2.- Necesitamos extraer ña req.file , lo coloco como paramtro dela función subirArchivo() y lo llamaremos files, para poderlo extraer la req.files pero como ya viene el el paramtro file  no necesito req.files, lo sustitituyo por el parametro files
	//3.- Coloco como tercer parametro en la función subirArchivo() para que  almacenar la infomacion correspondiente de lo que quiero guardar
	return new Promise((resolve, reject) => {
		//? Se corto parte de a funcion cargarArchivo y  se agregoo aqui
		const { archivo } = files; //req.files; //? Optenomos una propirdad llamada archivo que viene en la request  y se que existe ya que lo chequeamos en la intrucción de arriba lineas 28  al 31.

		//*  procederemos a sacar el nombre del archivo, utilizando el metodo split() para separar  el archivo.name que es un string. donde está  el punto de la extension del archivo (que es el identificado) y este  lo colocaremos como argumento  en el método split ('.') para poder hacer la separación en ese lugar de posición.

		const nombreCortado = archivo.name.split('.');

		//* obtendremos la extension
		const extension = nombreCortado[nombreCortado.length - 1];
		//* Ahora veamoslo en postman
		//lod eabajo es para verlos en la consola del terminal
		console.log('el archivo que sera subido si es:');
		console.log(nombreCortado);
		console.log({ extension });

		//* Ahora necesito validar la extension  y la compararems con las extensiones que quero que sean aceptadas. La cuaeles estaran en un arreglo dicahas extensiones válidas.

		//Colocaremps esta varible como prametro de la funcion para hacer mas flexible la funcion subirArchivos. Por lo que podemos eliminar esta vaiable ,  la haremos con un cometrio

		//const extensionesValidas = ['png', 'jpg', 'gif'];

		//? validemos la extension que   contiene el archivo que estamos subiendo al servidor .preguntando si la  extension que esta subiendo no  esta dentro de las validas (!extensionesValidas.includes(extension),  que reporte un mesje )
		if (!extensionesValidas.includes(extension)) {
			return reject(
				`La extension : ${extension} no es valida, las requeridas son: ${extensionesValidas}`,
			);

			//Todo: lo de abajo sera sustituido por un rejec:
			// return res.status(400).json({
			//     msg: `No es valida la ${extension}, las requeridas son: ${extensionesValidas}`,
			// });
		}

		//TODO: Craremos una variable llamada nombreTemp, para guardar el archivo con el nuevo nombre único, com el puto  y  su extension. y en la linea  66 coambiare el parametro: archivo.name  por  nombreTemp. que sera el nombre único.

		const nombreTemp = uuidv4() + '.' + extension;

		//*Fin de nombre cortado.
		//TODO: construimos el ptah cdonde quiero que se guarde ese archivo que este subiendo o lo que sea que este subiendo

		//TODO:  Utilizaremos la libreria path que es propiamente de nodejs , la cual utilizaremos la funcion path.join para  hacer la ruta donde voy a colocar ese archivo, ojo ;  recuerde que _dirname apunta a la carpeta controllers para enlazarlo con la carpeta uploads de unirlos cun el + y ../uploads y todo esto lo enlazamos con nombre del archivo  que  quiero subir; por medio de "  + archivo.name  ". Recuerde crear un carpeta en la raiz del proyecto llamada "uploads"

		const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp); //* agregaremos al path la carpeta que la creara s no existe y dentro de elle guardará en mombreTemp del archivo que quiero guardar cin un mobre único.
		console.log({ rutaDelArchivo: uploadPath }); //MOSTRAMOS EN EL TERMINAL LA RUTA DONDE ESTAR UBICADO EL ARCHIVO QUE SE SUBIO AL SERVIDOR.
		//TODO: ahora utilizamos la propiedad mover "mv" pro medio de archivo.moe (primer argumento, segundo argumento) , donde el promer argumento de este es el el destino donde quiero colocar ese archivo, y el segundo será el error por si algo sale mal, que no es más que un coulback
		archivo.mv(uploadPath, (err) => {
			if (err) {
				// sustituimos todo lo de abajo por un reject para que nos mustre el error so ocurre
				// //TODO: Generralemente debo clolocarlo en consola para //mostrar el eror
				// console.log({ msg: err });
				// return res.status(500).json({ err });
				reject(err);
			}
			//  todo lo de abajo sera sustituido por un resolve para obtener la respuesta si todo sale bien. que será un resolve(con el parametro que quiero mandar).
			// res.json({ msg: 'Arechivo subido a :' + uploadPath });
			resolve(nombreTemp); //? Como quiero que solo me suba el nombre del archivo que estoy guardando (nombreTemp) y no el path (uploadPath) con el nombre del archivo  donde se guarda. porque eso es lo que podra utilzar el la persona que quiera  obtener el nombe del archivo. sustituiré uploadPath por nombreTemp
		});
	});
};

module.exports = {
	subirArchivo,
};
