"# Lab08CalificadoExamen" 
# Sistema de Gestión de Clientes y Productos

Este proyecto implementa una aplicación web para la gestión de clientes y productos, con un frontend en React y un backend en Node.js con Express, utilizando MySQL como base de datos. Todo el sistema está preparado para ser desplegado con Docker y Docker Compose.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Pasos para el Despliegue](#pasos-para-el-despliegue)
  - [1. Clonar el Repositorio](#1-clonar-el-repositorio)
  - [2. Configuración del Entorno](#2-configuración-del-entorno)
  - [3. Desplegar con Docker Compose](#3-desplegar-con-docker-compose)
  - [4. Verificar el Despliegue](#4-verificar-el-despliegue)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [APIs Disponibles](#apis-disponibles)
- [Solución de Problemas](#solución-de-problemas)
- [Personalización](#personalización)

## Requisitos Previos

Para desplegar este proyecto necesitas tener instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (opcional, para clonar el repositorio)

## Estructura del Proyecto

```
├── backend/                  # Servidor API en Node.js/Express
│   ├── Dockerfile            # Configuración Docker para el backend
│   ├── package.json          # Dependencias del backend
│   └── server.js             # Archivo principal del servidor
├── frontend/                 # Aplicación React
│   ├── Dockerfile            # Configuración Docker para el frontend
│   ├── package.json          # Dependencias del frontend
│   ├── public/               # Archivos públicos de React
│   └── src/                  # Código fuente de React
├── backend/db/init.sql       # Script SQL para inicializar la base de datos
└── docker-compose.yml        # Configuración para orquestar los contenedores
```

## Pasos para el Despliegue

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Lab08CalificadoExamen
```

### 2. Configuración del Entorno

En este proyecto, todas las configuraciones necesarias están incluidas en los archivos Dockerfile y docker-compose.yml. La base de datos tiene preconfigurados los siguientes valores:

- **Usuario**: root
- **Contraseña**: password
- **Base de datos**: appdb

Si deseas cambiar estos valores, modifica el archivo `docker-compose.yml` en las secciones correspondientes.

### 3. Desplegar con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando:
- Construirá las imágenes Docker para el frontend y backend
- Creará un contenedor para MySQL
- Inicializará la base de datos con los datos de ejemplo
- Conectará todos los servicios en una red
- Configurará los puertos necesarios

La primera vez que ejecutes este comando puede tardar varios minutos, ya que necesita descargar las imágenes base y construir las imágenes personalizadas.

### 4. Verificar el Despliegue

Una vez que el despliegue se complete, puedes verificar que los contenedores estén funcionando correctamente:

```bash
docker-compose ps
```

Deberías ver tres contenedores ejecutándose:
- `frontend`: Aplicación React en el puerto 3000
- `api`: API en Node.js en el puerto 3001
- `db`: Base de datos MySQL en el puerto 3306

## Uso de la Aplicación

Una vez desplegada la aplicación, puedes acceder a ella a través de:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

Credenciales de usuario demo:
- **Email**: demo@example.com
- **Contraseña**: password123

También puedes crear tu propio usuario a través de la interfaz de registro.

## APIs Disponibles

El backend proporciona las siguientes APIs:

### Clientes

- `GET /api/clientes`: Listar todos los clientes
- `POST /api/clientes/registro`: Registrar un nuevo cliente
- `POST /api/clientes/login`: Iniciar sesión

### Productos

- `GET /api/productos`: Listar todos los productos
- `GET /api/productos/buscar?termino=X`: Buscar productos por nombre o descripción

## Solución de Problemas

### Si los contenedores no inician correctamente:

1. Verifica los logs de cada contenedor:
   ```bash
   docker-compose logs api
   docker-compose logs frontend
   docker-compose logs db
   ```

2. Reinicia los contenedores:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Problemas comunes:

- **Error de conexión a la base de datos**: Asegúrate de que el contenedor de MySQL esté en ejecución antes de iniciar el API.
- **El frontend no puede conectarse al API**: Verifica que las URLs en el código frontend apunten a http://localhost:3001.

## Personalización

### Cambiar la información de la base de datos:

1. Modifica las credenciales en `docker-compose.yml` en la sección `db`.
2. Actualiza las mismas credenciales en la sección `api` para la conexión.

### Añadir más productos o clientes:

Puedes modificar el archivo `backend/db/init.sql` para añadir más registros iniciales.

### Cambiar puertos:

Si necesitas cambiar los puertos, modifica el archivo `docker-compose.yml` en las secciones `ports` de cada servicio.

---

¡Listo! Ahora deberías tener el Sistema de Gestión de Clientes y Productos funcionando correctamente en tu entorno local.