
// import {createClient} from '@libsql/client';
// import dotenv from 'dotenv';

// dotenv.config();

//  export const db = createClient({
//   url: process.env.TURSO_DATABASE_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
// });
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TURSO_DB_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('Error: Variables de entorno TURSO_DB_URL y TURSO_AUTH_TOKEN son requeridas');
    process.exit(1);
}

export const db = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

// Test de conexión
try {
    await db.execute('SELECT 1');
    console.log('Conexión a Turso DB establecida correctamente');
} catch (error) {
    console.error('Error conectando a Turso DB:', error);
    process.exit(1);
}