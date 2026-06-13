import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definida');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mensajes_chat (
        id SERIAL PRIMARY KEY,
        emisor_tipo VARCHAR(20) NOT NULL,
        nodo_id TEXT,
        contenido TEXT NOT NULL,
        fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    COMMENT ON COLUMN mensajes_chat.emisor_tipo IS 'Indica si el mensaje vino del dispositivo móvil o del wearable';
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_mensajes_chat_fecha_envio ON mensajes_chat (fecha_envio DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_mensajes_chat_emisor_tipo ON mensajes_chat (emisor_tipo);
  `);
}
