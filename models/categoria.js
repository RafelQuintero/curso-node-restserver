//* Crearemos el nuevo model  para la coelccion categorias que se creara  en mongoDB-ATLAS

const { Schema, model } = require('mongoose');

//* Creamos el Schema para el modelo de la categoria

const CategoriaSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'EL NOMBRE ES OBLIGATORIO'],
	},
	estado: {
		type: Boolean,
		default: true,
		required: true,
	},

	//*Usuario para saber quien creo la categoria
	usuario: {
		type: Schema.Types.ObjectId, //*Decimos que tendremos otro  objeto que vamos a obtenr en  Mongo-Atlas
		ref: 'Usuario', //*Hace referncia (ref) a la colección a la que apunta, es a Usuario (QUE ES MI OTRO SCHEMA, Recurede que debe estar en mayuscula el nombre y en singular , exactamente como se creo el modelo de Usuario).
		required: true, //*Todas la categorias tienen que tener un usuario, porque si estoy intentando grabar una categoria y no le mando un ususrio me dará un error.
	},
});

///******/
//? crearemos metodos para sobreescribir el modelo de Schema  o modificarlo de la siquinte manera . Ojo debe ser una funcion creada con la palabra funtion par que el this tenga el contexto dentro de esta funcion
CategoriaSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();

	return data; //?   todos los datos del modelo se mostrara en usuario  y se excluira __v y el password
};

//****/

module.exports = model('Categoria', CategoriaSchema);
