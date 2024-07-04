const jwt = require('jsonwebtoken');

//* Como quiero que que a la funcion  await generarJWT  trabaje ytrabaje  en base a promesa  dedebo hacer lo siguiente:
//* debo de pasarle como argumento el uid que es el identificado unico del usuario "uid"
const generarJWT = (uid = ' ') => {
	return new Promise((resolve, reject) => {
		//* Que debo hacer es generar ese jwt
		//* grabo lo que voy a mandadar en el payload que es eslo el uid, pero se puede grabar cualquier cosa

		const payload = { uid };
		jwt.sign(
			payload,
			process.env.SECRETOPRIVETEKEY,
			{
				expiresIn: '4h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo generar el token');
				} else {
					resolve(token);
				}
			},
		);
	});
};
module.exports = {
	generarJWT,
};
