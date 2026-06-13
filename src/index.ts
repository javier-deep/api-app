import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { mensajesRouter } from './routes/mensajes.js';
import { pool } from './db.js';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const corsOrigin = process.env.CORS_ORIGIN ?? '*';

app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin }));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

app.get('/', (_req, res) => {
  res.json({
    name: 'chat-backend',
    version: '1.0.0',
    endpoints: ['/health', '/mensajes'],
  });
});

app.use('/mensajes', mensajesRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
