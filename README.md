# Elec Web Vehículos

Este proyecto es una aplicación para gestionar vehículos, permitiendo a los administradores crear, leer, actualizar y eliminar información sobre ellos.

## Requisitos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [MySQL](https://www.mysql.com/) o [XAMPP](https://www.apachefriends.org/index.html) (para manejar la base de datos)

## Clonar el Repositorio

Para clonar este repositorio en tu máquina local, abre la terminal (o Git Bash) y ejecuta:

```bash

git clone https://github.com/EDWINGOMEZ833/Elec_Web_Vehiculos.git

## Configuración de la Base de Datos

-  Crear la Base de Datos: Antes de ejecutar la aplicación, necesitas configurar la base de datos. Abre tu cliente de MySQL y ejecuta el script SQL que se encuentra en script-db/script_base_datos.sql. Este script creará la base de datos y las tablas necesarias.

sql

-- Ejecuta este script en tu cliente de MySQL
SOURCE script-db/script_base_datos.sql;
Configurar el Servidor: Asegúrate de que la configuración de la base de datos en el archivo src/server.js (o el archivo correspondiente) apunte a la base de datos que acabas de crear.


##
const dbConfig = {
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'nombre_de_la_base_de_datos'
};

##Instalar Dependencias

npm install

## Ejecutar la Aplicación
-  Una vez que hayas configurado la base de datos y las dependencias, puedes iniciar el servidor:

 npm start

-  La aplicación estará disponible en http://localhost:3000 (o en el puerto que hayas configurado).

##Uso
-  Puedes acceder a las diferentes funcionalidades de la aplicación, incluyendo:

* Crear nuevos vehículos.
* Ver la lista de vehículos.
* Actualizar información de vehículos existentes.
* Eliminar vehículos.

Para más detalles sobre la funcionalidad, revisa los archivos en public/ y src/
