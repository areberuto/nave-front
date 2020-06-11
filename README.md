INSTRUCCIONES DE ARRANQUE PARA EL PROYECTO
-------------------------------------------

BASE DE DATOS
----------

La base de datos utilizada es MySQL, servida con XAMPP.

El archivo script.sql, incluido en './servidor/base de datos/',
contiene las queries para crear la base de datos y sus tablas. El schema
puede consultarse en la imagen "schema.png", en la misma carpeta.

BACK-END
----------

El back-end utilizado es express.js, ejecutado con Node.js.

En caso de no tener instalado Node, puede descargarse aquí:

https://nodejs.org/es/download/

Pasos para arrancar el back-end:
-----

- Abrir una CLI en el directorio de servidor. Ejecutar "npm install".

- Una vez instalado los módulos, para correr el servidor ejecutar el comando "npm start".

- Si se quieren restaurar los datos originales, se puede utilizar el comando "npm run seed".

Funcionalidad node_mailer
-----

Para mandar el correo de verificación a la hora de registrar un nuevo usuario, y para
la funcionalidad de recuperar la contraseña, se necesita una cuenta de correo de gmail
con permiso para ser utilizada por aplicaciones extrañas, además de su clave.

Por motivos de seguridad, no incluyo la cuenta personal que he utilizado para ello.

Para utilizar la funcionalidad, en el archivo ./server/middleware/middleLogin.js, en las
lineas 15 y 16, están las propiedades donde se puede incluir una cuenta de correo y una
clave para emitir los correos.



FRONT-END
----------

El front-end utilizado es Angular.

Para arrancar el front, incluirlo en la carpeta htdocs incluida en el directorio de xampp,
y acceder al directorio raíz desde localhost (por ejemplo, si el directorio es "proyecto",
escribir en el navegador localhost/proyecto).

¡IMPORTANTE! El front sólo podrá comunicarse con el back cuando éste último esté corriendo en Node
(es decir, ejecutándose con el comando npm start en una consola con Node).


USUARIOS Y CLAVES
----------

El usuario administrador:
- areberuto.dev@gmail.com
- 1234clave

Un usuario estándar:
- ausonia@gmail.com
- 1234clave



