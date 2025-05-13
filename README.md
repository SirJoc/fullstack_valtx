Proyecto Fullstack: Gestión de Productos con Carga de Imágenes

Este proyecto es una aplicación web Fullstack que demuestra la implementación de un CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de productos, incluyendo la funcionalidad de carga de imágenes. Está desarrollado con un backend en NestJS y un frontend en Angular.
✨ Características Principales

    Gestión Completa de Productos: Creación, visualización, edición y eliminación de productos.
    Carga de Imágenes: Funcionalidad para subir y asociar imágenes a los productos.
    API RESTful: Backend robusto y documentado con NestJS.
    Interfaz de Usuario Interactiva: Frontend desarrollado con Angular para una experiencia de usuario fluida.

🛠️ Tecnologías Utilizadas (Ejemplo)

    Backend: NestJS, TypeScript, SQL Server (con Prisma como ORM, por ejemplo)
    Frontend: Angular, TypeScript, HTML, SCSS/CSS
    Base de Datos: Microsoft SQL Server
    Documentación API: Swagger (OpenAPI)

📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

    Node.js (versión LTS recomendada)
    npm (generalmente viene con Node.js)
    Angular CLI (opcional, para el comando ng serve): npm install -g @angular/cli
    Una instancia de Microsoft SQL Server (local, Docker, o remota)
    Git

🚀 Configuración y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

💾 Configuración de la Base de Datos (SQL Server)

Se proporcionan dos archivos para configurar la base de datos imagedb: schema.sql y imagedb.bak.

    schema.sql:
        Contiene las sentencias DDL (CREATE DATABASE, CREATE TABLE, etc.) y DML (INSERT INTO) necesarias para crear la estructura de la base de datos y cargar datos iniciales.
        Recomendación: Utiliza este archivo si estás configurando la base de datos desde cero en una instancia de SQL Server en Docker o si tienes SQL Server instalado directamente en un sistema Linux.
        Ejecución: Puedes ejecutar este script usando herramientas como SQL Server Management Studio (SSMS), Azure Data Studio, DBeaver, o mediante la utilidad de línea de comandos sqlcmd.

    imagedb.bak:
        Es un archivo de respaldo nativo de SQL Server que contiene la base de datos completa (esquema y datos).
        Recomendación: Utiliza este archivo si prefieres restaurar la base de datos directamente. Es generalmente más rápido, especialmente si no estás usando Docker o SQL Server en Linux, o si simplemente prefieres el método de restauración estándar de SQL Server.
        Restauración: Puedes restaurar este backup usando SQL Server Management Studio (SSMS), Azure Data Studio, DBeaver (a través de sus herramientas de restauración), o mediante el comando RESTORE DATABASE de T-SQL. Asegúrate de que la ruta al archivo .bak sea accesible por el servidor SQL Server. Un ejemplo del comando que podrías necesitar ejecutar (ajusta las rutas según tu entorno):
        SQL

        RESTORE DATABASE [imagedb]
        FROM DISK = N'/ruta/completa/hacia/tu/imagedb.bak'
        WITH FILE = 1, -- O el número de archivo correcto si hay múltiples backups en el mismo archivo
             MOVE N'imagedb' TO N'/var/opt/mssql/data/imagedb.mdf', -- Ajusta el nombre lógico y la ruta del MDF
             MOVE N'imagedb_log' TO N'/var/opt/mssql/data/imagedb_log.ldf', -- Ajusta el nombre lógico y la ruta del LDF
             NOUNLOAD,
             REPLACE, -- Sobrescribe la base de datos si ya existe
             STATS = 5;
        GO

        Nota: Los nombres lógicos ('imagedb', 'imagedb_log') y las rutas de los archivos (.mdf, .ldf) deben coincidir con la configuración de tu servidor SQL o ajustarse a donde deseas que residan los archivos de la base de datos restaurada.



📁 Backend (NestJS)

    Clonar el Repositorio:
    Bash

git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_CARPETA_PROYECTO>/backend # Navega a la carpeta del backend

Configuración del Entorno:

    Crea un archivo .env en la raíz de la carpeta del backend (puedes duplicar y renombrar un posible .env.example).
    Modifica la cadena de conexión DATABASE_URL (o la variable correspondiente) en el archivo .env para que apunte a tu instancia de base de datos MSSQL. Ejemplo:
    Code snippet

    DATABASE_URL="sqlserver://tu_usuario:tu_contraseña@localhost:1433;database=imagedb;trustServerCertificate=true"

Instalar Dependencias:
Bash

npm install

Configuración de la Base de Datos:

    Consulta la sección "💾 Configuración de la Base de Datos" más abajo para restaurar o crear la base de datos.

Ejecutar el Servidor de Desarrollo:
Bash

    npm run start:dev

    El backend se ejecutará normalmente en http://localhost:3000.

    Documentación de la API (Swagger):
        Una vez que el backend esté en ejecución, puedes acceder a la documentación de la API generada por Swagger (OpenAPI) en la siguiente ruta: http://localhost:3000/openapi
![image](https://github.com/user-attachments/assets/8ebdb95b-f499-4ccc-98c1-ed95c90fe570)


🖥️ Frontend (Angular)

    Navegar a la Carpeta del Frontend:
    Bash

cd <NOMBRE_CARPETA_PROYECTO>/frontend # Asegúrate de estar en la carpeta del frontend

Instalar Dependencias:
Bash

npm install

Ejecutar el Servidor de Desarrollo:

    Si tienes Angular CLI instalado globalmente:
    Bash

ng serve

De lo contrario, puedes usar el script definido en package.json:
Bash

        npm run start

    La aplicación Angular se ejecutará normalmente en http://localhost:4200.


🖼️ Vistas Previas del Proyecto (Ejemplos)

Inicio de sesión:
![image](https://github.com/user-attachments/assets/ff54511a-c6dd-41cb-9ae7-9711b0ef6ba1)


SWAGGER:
![image](https://github.com/user-attachments/assets/9e07d200-de81-4cdb-8f3c-3d8d4b0d2a51)


Listado de Productos:
![image](https://github.com/user-attachments/assets/e77c7a79-f46a-4579-a278-efebe514864a)


Formulario de Creación/Edición de Producto:
![image](https://github.com/user-attachments/assets/1fa341eb-23d6-4267-b911-145b4c160308)
![image](https://github.com/user-attachments/assets/03118860-3be4-4730-9f1b-b83928d4a0f2)


Funcionalidad de Carga de Imágenes:
![image](https://github.com/user-attachments/assets/8b930b8f-34f8-4ffd-815e-d81e578e4b3c)
![image](https://github.com/user-attachments/assets/4546bb86-4a66-4a59-81e6-b51e3351bb91)
![image](https://github.com/user-attachments/assets/f416c113-c32e-426f-a384-0bf1f1421285)

    
