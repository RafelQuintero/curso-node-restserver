//! Creare una constante llamadad Categoria con "C" Mayuscula

const Categoria = require('./categoria');
const Producto = require('./producto');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');

//* con los codigos 2,3,4,y 5 ,ya tengo cada uno de los modelos y necesito exportarlos

module.exports = {
	Categoria,
	Producto,
	Role,
	Server,
	Usuario,
};
