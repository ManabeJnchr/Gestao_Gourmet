import pool from './database';

async function initdb () {

    try {
        // Inicializar tabelas:
        await pool.query(`
        CREATE TABLE IF NOT EXISTS funcionario (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            cpf VARCHAR(14) UNIQUE NOT NULL,
            cargo_id INTEGER NOT NULL,
            telefone VARCHAR(15) NOT NULL
        );
        `)
    } catch (error) {
        console.error("# Erro ao verificar/criar tabelas: ", error);
    }
}

export default initdb;