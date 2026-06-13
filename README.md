# Chat Backend

API en Node.js + Express para guardar y consultar mensajes entre celular y reloj usando PostgreSQL.

## Requisitos

- Node.js 20 o superior
- PostgreSQL

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

- `PORT`: puerto local
- `DATABASE_URL`: cadena de conexión a PostgreSQL
- `CORS_ORIGIN`: origen permitido para CORS

## Instalar y ejecutar localmente

```bash
npm install
npm run build
npm start
```

En desarrollo:

```bash
npm run dev
```

## Crear la tabla

Ejecuta el archivo `sql/schema.sql` en tu base de datos PostgreSQL.

## Endpoints

- `GET /health`: verifica si la API y la base de datos responden
- `GET /mensajes`: lista mensajes con paginación por `limit` y `offset`
- `GET /mensajes/:id`: obtiene un mensaje por id
- `POST /mensajes`: crea un mensaje

### Ejemplo de `POST /mensajes`

```json
{
  "emisor_tipo": "CELULAR",
  "nodo_id": "wear-os-01",
  "contenido": "Hola desde el móvil"
}
```

## Despliegue en Render

La forma más simple es usar el archivo `render.yaml`.

1. Sube este proyecto a GitHub.
2. En Render, crea un nuevo `Blueprint` y conecta el repositorio.
3. Render creará el servicio web y la base de datos PostgreSQL definidos en `render.yaml`.
4. Cuando termine, Render te dará una URL pública como `https://tu-api.onrender.com`.

Si prefieres hacerlo manualmente:

1. Crea una base de datos PostgreSQL en Render.
2. Crea un `Web Service` apuntando al mismo repo.
3. Usa estos comandos:
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Agrega la variable de entorno `DATABASE_URL` con la cadena de conexión de la base de datos.
5. Aplica el esquema con `sql/schema.sql`.

## Pruebas rápidas

```bash
curl http://localhost:3000/health
curl http://localhost:3000/mensajes
```
