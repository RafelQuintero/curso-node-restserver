//todo: Adquerimos todsa la informacion del DOTENV
require('dotenv').config();

//? IMPORTEMOS server que es la costruccion de la clase para incializar la ejecucion  de mi SERVEXPRESS

const Server = require('./models/server');

//? PAra saver si esta corriendo bien, luego se puede borrarar

console.log('HOLA MUNDO');

//todo: crearemos el webserver con express

const server = new Server(); //Creando la instacia par tomar toda la informacion d la clase serer().

//! LANCEMOS EL METODO listen

server.listen();

//? PASO 1.- TARBAJAREMOS LA INICALIZACION DE MI SERVIDOR PARA QUE ESTE COFIGURADO EN UNA CLASS
//? PASO  2- CREAREOMOS LA CARPETA PUBLICA  y esta el la que siempre se ejecutara como primera prioridad ya que es la que estara en la ruta raiz 8080. Ejecutandose por por medio de un middelwar.
//? PASO 3.- Instalaremos eñ modlo cors com la finaldad que soño podamos acceer a cieras dircciones en especifico.
