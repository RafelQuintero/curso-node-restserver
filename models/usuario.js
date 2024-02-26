//? En este archivo crearemos nuestro modelo de usuario que es un coleccion de datos expresado como un objeto {}
//? Obteniendolo el Schema por medio de una desectruracion  al modulo monggose

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
	//* Aqui colocaremos todo lo que se refiere  a lo que contendra el modele de usoario, observe que se hace por edio de un objeto

	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	correo: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true, //? Esto debemos validadrlo
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria'],
	},
	img: {
		type: String,
	},
	rol: {
		type: String,
		required: [true, 'El rol es obligatoria'],
		emun: ['ADMIN_ROLE', 'USER_ROLE'], //? Solo aceptara estas dos condicones.
	},
	estado: {
		type: Boolean,
		default: true, //*Cuando creo un usoario por defecto va  estar activado.
	},
	google: {
		type: Boolean,
		default: false, //*Cuando es creado por google.
	},
});

//? crearemos metodos para sobreescribir el modelo de Schema  o modificarlo de la siquinte manera . Ojo debe ser una foncion creada con la palabra funtion par que el this tenga el contexto dentro de esta funcion
UsuarioSchema.methods.toJSON = function () {
	const { __v, password, ...usuario } = this.toObject();
	return usuario; //?   todos los datos del modelo se mostrar y se exclira __v y el password
};

module.exports = model('Usuario', UsuarioSchema);
//* ACLARATORIA:  COMO PRIMER PARAMETRO; Se coloca el nombre de la coleccion en singular,  Pero mongoose le agrega una "s" a final colocanadole a la coleccion con un  nombre en plural. Que no es mas que una tabal de datos. EL SEGUNDO PARAMETRO ES: el Schema que lleva por nombre: " UsuarioSchema"  cambie pokedes por usuarios.
