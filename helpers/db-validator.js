//!TOmaremos la funcion que esta dentro del argumento  de custom que esta en la linea 47 del archivo ausarios.js y se la asignaremos a una variable "esRolvalido"
const Role = require('../models/role.js');
const Usuario = require('../models/usuario.js');

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
		//* Pregunamos: Si   el usuario no existe por ese  el id, se mandaria como respuesta un null , enviaremos un mensaje de error.

		throw new Error(`NO EXISTE EL USUARIO CON EL id: ${id}`); //* escribimos que a ocurrido un error.
	}
};

module.exports = {
	esRolvalido,
	emailExiste,
	existeUsuaroPorId,
};
