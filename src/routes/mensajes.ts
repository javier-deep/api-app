import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
const tiposValidos = new Set(['CELULAR', 'RELOJ']);

router.get('/', async (_req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(String(_req.query.limit ?? '50'), 10) || 50, 1), 200);
    const offset = Math.max(Number.parseInt(String(_req.query.offset ?? '0'), 10) || 0, 0);

    const result = await pool.query(
      `SELECT id, emisor_tipo, nodo_id, contenido, fecha_envio
       FROM mensajes_chat
       ORDER BY fecha_envio DESC, id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    res.json({
      data: result.rows,
      pagination: { limit, offset, count: result.rowCount },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }

    const result = await pool.query(
      `SELECT id, emisor_tipo, nodo_id, contenido, fecha_envio
       FROM mensajes_chat
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    return res.json({ data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { emisor_tipo, nodo_id = null, contenido } = req.body ?? {};

    if (!tiposValidos.has(emisor_tipo)) {
      return res.status(400).json({ error: 'emisor_tipo debe ser CELULAR o RELOJ' });
    }

    if (typeof contenido !== 'string' || contenido.trim().length === 0) {
      return res.status(400).json({ error: 'contenido es obligatorio' });
    }

    if (nodo_id !== null && typeof nodo_id !== 'string') {
      return res.status(400).json({ error: 'nodo_id debe ser texto o null' });
    }

    const result = await pool.query(
      `INSERT INTO mensajes_chat (emisor_tipo, nodo_id, contenido)
       VALUES ($1, $2, $3)
       RETURNING id, emisor_tipo, nodo_id, contenido, fecha_envio`,
      [emisor_tipo, nodo_id, contenido.trim()],
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export { router as mensajesRouter };
