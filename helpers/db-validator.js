//!TOmaremos la funcion que esta dentro del argumento  de custom que esta en la linea 47 del archivo ausarios.js y se la asignaremos a una variable "esRolvalido"
//const {Categoria } = require('../models/index.js');
//const Role = require('../models/role.js');
//const { Usuario } = require('../models');
//*Las lineas 2,3,4 se puden declarar de la siguinete manera ya que todas se declaran  en el archivo index.js. Se puede no escribir el archivo index.js en require, ya que lo  reconoe por defecto.
const { Usuario, Categoria, Role, Producto } = require('../models');

//* debemos exporta mongoose para poder utilizar un metod de monggose

const esRolvalido = async (rol = '') => {
	const existeRol = await Role.findOne({ rol: rol });
	if (!existeRol) {
		throw new Error(`Este  rol: ${rol} no existe en la base de datos `); //* Este es un error persolaizado que lo captura "custom"  y será el mensaje que se quiera poner
	}
};

const emailExiste = async (correo = '') => {
	const existeEmail = await Usuario.findOne({ correo: correo });
	if (existeEmail) {
		throw new Error(`EL CORREO : ${correo} YA ESTÄ REGISTRADO`);
	}
};

//*Crearemos un modulo  par saber que el usuario esta registrado con el id  en mongoDBATLAS

const existeUsuaroPorId = async (id) => {
	const existeUsuario = await Usuario.findById(id); //Localizmos el Usuario  por ese id
	//y preguentamso que si existe  ese usuario en la DB.

	if (!existeUsuario) {
		//* Preguntamos: Si   el usuario no existe por ese  el id, se mandaria como respuesta un null , enviaremos un mensaje de error.

		throw new Error(`NO EXISTE EL USUARIO CON EL id: ${id}`); //* escribimos que a ocurrido un error.
	}
};

//* Crearemos un funcion para  validad si existe la categoria por id

const existeCategoriaPorId = async (id) => {
	const existeCategoria = await Categoria.findById(id); //*Localizmos La categoria  por su id
	//* preguentamso que si existe  ese categoria en la DB.

	if (!existeCategoria) {
		//* Preguntamos: Si   la Categoria no existe por ese  el id, se mandaria como respuesta un null , enviaremos un mensaje de error.

		throw new Error(`NO EXISTE LA CATEGORIA  CON EL id: ${id}`); //* escribimos que a ocurrido un error.
	}
};

//*Crearemos la funcion para ver si exite producot por id
const existePorductoPorId = async (id) => {
	const existeProducto = await Producto.findById(id); //*LocalizmosE el proucto por su id
	//* preguentamso que si existe  ese roducto en la DB.

	if (!existeProducto) {
		//* Preguntamos: Si   El Producto no existe por ese  el id, se mandaria como respuesta un null , enviaremos un mensaje de error.

		throw new Error(`NO EXISTe EL PRODUCTO CON EL id: ${id}`); //* escribimos que a ocurrido un error.
	}
};

//*Fin de existeProducotPorId

module.exports = {
	esRolvalido,
	emailExiste,
	existeUsuaroPorId,
	existeCategoriaPorId,
	existePorductoPorId,
};
