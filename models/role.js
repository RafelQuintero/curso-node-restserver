//* Crearemos el nuevo model  para la coelccion roles que se creo en mongoDB-ATLAS

const { Schema, model } = require('mongoose');

//* Creamos el Schema para el modelo del rol que se va a verificar contra la coleccion roles en mongodb Atlas

const RolesSchema = new Schema({
	rol: {
		type: String,
		required: [true, 'EL ROL(E) ES OBLIGATORIO'],
	},
});

module.exports = model('Role', RolesSchema);
