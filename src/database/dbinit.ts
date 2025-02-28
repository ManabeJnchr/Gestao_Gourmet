import { table } from "console";
import { Pool } from "pg";

async function initdb (pool: Pool) {

    try {
        // Verificar se já existe alguma tabela:
        const tableExists = await pool.query(`SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'cargo'
            )
        `)
        if (tableExists.rows[0].exists) {
            return; // Tabelas já foram criadas
        }

        // Caso contrário, inicializar tabelas:
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cargo (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50) UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS funcionario (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) UNIQUE NOT NULL,
                cargo_id INTEGER NOT NULL,
                telefone VARCHAR(15) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS cardapio (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                valor DECIMAL(10,2) NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                ingredientes TEXT,
                imagem BYTEA
            );
            CREATE TABLE IF NOT EXISTS mesa (
                id SERIAL PRIMARY KEY,
                numero_da_mesa INT UNIQUE NOT NULL,
                numero_de_lugares INT NOT NULL,
                estado_da_mesa VARCHAR(20) DEFAULT 'disponivel'
            );
            CREATE TABLE IF NOT EXISTS pedido (
                id SERIAL PRIMARY KEY,
                numero_da_mesa INT NOT NULL,
                item_id INTEGER NOT NULL,
                quantidade INT NOT NULL CHECK (quantidade > 0),
                observacao TEXT,
                garcom_responsavel_id INTEGER NOT NULL,
                estado_do_pedido VARCHAR(50) NOT NULL,
                data DATE NOT NULL DEFAULT CURRENT_DATE,
                hora TIME NOT NULL DEFAULT CURRENT_TIME,
                FOREIGN KEY (numero_da_mesa) REFERENCES mesa(id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES cardapio(id) ON DELETE CASCADE,
                FOREIGN KEY (garcom_responsavel_id) REFERENCES funcionario(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS pagamento (
                id SERIAL PRIMARY KEY,
                mesa_id INTEGER NOT NULL,
                estado_do_pagamento VARCHAR(50) NOT NULL,
                pedido_id INTEGER NOT NULL,
                valor_total DECIMAL(10,2) NOT NULL,
                meio_de_pagamento VARCHAR(50) NOT NULL,
                data DATE NOT NULL DEFAULT CURRENT_DATE,
                hora TIME NOT NULL DEFAULT CURRENT_TIME,
                FOREIGN KEY (mesa_id) REFERENCES mesa(id) ON DELETE CASCADE,
                FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS checkin (
                id SERIAL PRIMARY KEY,
                checkin BOOLEAN NOT NULL,
                checkout BOOLEAN NOT NULL,
                mesa_id INTEGER NOT NULL,
                FOREIGN KEY (mesa_id) REFERENCES mesa(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS relatorio_funcionario (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) NOT NULL,
                telefone VARCHAR(15) NOT NULL,
                cargo VARCHAR(50) NOT NULL,
                data DATE NOT NULL DEFAULT CURRENT_DATE,
                hora TIME NOT NULL DEFAULT CURRENT_TIME,
                criador_id INTEGER NOT NULL,
                FOREIGN KEY (criador_id) REFERENCES funcionario(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS relatorio_pedido (
                id SERIAL PRIMARY KEY,
                numero_da_mesa INT NOT NULL,
                item_id INTEGER NOT NULL,
                quantidade INT NOT NULL,
                garcom_responsavel_id INTEGER NOT NULL,
                estado_do_pedido VARCHAR(50) NOT NULL,
                valor_total DECIMAL(10,2) NOT NULL,
                data DATE NOT NULL DEFAULT CURRENT_DATE,
                hora TIME NOT NULL DEFAULT CURRENT_TIME,
                criador_id INTEGER NOT NULL,
                FOREIGN KEY (numero_da_mesa) REFERENCES mesa(id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES cardapio(id) ON DELETE CASCADE,
                FOREIGN KEY (garcom_responsavel_id) REFERENCES funcionario(id) ON DELETE CASCADE,
                FOREIGN KEY (criador_id) REFERENCES funcionario(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS relatorio_cardapio (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                valor DECIMAL(10,2) NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                ingredientes TEXT,
                imagem BYTEA,
                data DATE NOT NULL DEFAULT CURRENT_DATE,
                hora TIME NOT NULL DEFAULT CURRENT_TIME,
                criador_id INTEGER NOT NULL,
                FOREIGN KEY (criador_id) REFERENCES funcionario(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS login (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha_de_acesso VARCHAR(255) NOT NULL,
                funcionario_id INTEGER UNIQUE NOT NULL,
                FOREIGN KEY (funcionario_id) REFERENCES funcionario(id) ON DELETE CASCADE
            );
        `)

        // Adicionar dados fundamentais
        await pool.query(`
            INSERT INTO cargo (nome) VALUES 
            ('Garçom'),
            ('Gerente'),
            ('Administrador'),
            ('Atendente');
            `)
        
    } catch (error) {
        console.error("# Erro ao verificar/criar tabelas: ", error);
    }
}

export default initdb;