import { Pool } from 'pg';
import dotenv from 'dotenv';
import dbinit from './dbinit'

dotenv.config();

const pool: Pool = new Pool ({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(async (client) => {
        console.log(`# Conectado ao banco de dados: ${pool.options.database || pool.options.connectionString}`);
        await dbinit(pool);
        client.release(); // Liberar a conexão de volta para o pool
    })
    .catch(err => {
        console.error("# ❌ Erro ao conectar ao banco de dados:", err);
    });

export default pool;