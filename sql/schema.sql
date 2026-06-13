CREATE TABLE IF NOT EXISTS mensajes_chat (
    id SERIAL PRIMARY KEY,
    emisor_tipo VARCHAR(20) NOT NULL,
    nodo_id TEXT,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN mensajes_chat.emisor_tipo IS 'Indica si el mensaje vino del dispositivo móvil o del wearable';

CREATE INDEX IF NOT EXISTS idx_mensajes_chat_fecha_envio ON mensajes_chat (fecha_envio DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_chat_emisor_tipo ON mensajes_chat (emisor_tipo);
