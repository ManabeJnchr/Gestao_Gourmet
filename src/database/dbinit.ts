import { table } from "console";
import { Pool } from "pg";

async function initdb(pool: Pool) {

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
            BEGIN;

            -- STATUS MESA;
            CREATE TABLE IF NOT EXISTS public.statusmesa
            (
                id_status SERIAL PRIMARY KEY,
                status VARCHAR(10) NOT NULL
            );

            -- MESA;
            CREATE TABLE IF NOT EXISTS public.mesa
            (
                id_mesa SERIAL PRIMARY KEY,
                numero_mesa INTEGER NOT NULL UNIQUE,
                qtd_lugares INTEGER NOT NULL,
                id_status INTEGER NOT NULL,
                CONSTRAINT fk_mesa_status FOREIGN KEY (id_status)
                    REFERENCES public.statusmesa (id_status)
            );

            -- CARDÁPIO;
            CREATE TABLE IF NOT EXISTS public.cardapio
            (
                id_cardapio SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                valor NUMERIC(10,2) NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                ingredientes TEXT,
                imagem BYTEA
            );

            -- CARGO;
            CREATE TABLE IF NOT EXISTS public.cargo
            (
                id_cargo SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL UNIQUE
            );

            -- Inserindo valores na tabela cargo
            INSERT INTO public.cargo (nome) VALUES 
                ('Administrador'),
                ('Atendente'),
                ('Garçom'),
                ('Gerente');

            -- FUNCIONÁRIO;
            CREATE TABLE IF NOT EXISTS public.funcionario
            (
                id_funcionario SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                id_cargo INTEGER NOT NULL,
                telefone VARCHAR(15) NOT NULL,
                imagem VARCHAR(254),
                CONSTRAINT fk_funcionario_cargo FOREIGN KEY (id_cargo)
                    REFERENCES public.cargo (id_cargo)
            );

            -- LOGIN;
            CREATE TABLE IF NOT EXISTS public.login
            (
                id_login SERIAL PRIMARY KEY,
                cpf VARCHAR(50) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                id_funcionario INTEGER NOT NULL UNIQUE,
                salt VARCHAR(255),
                session_token VARCHAR(255),
                primeiro_login BOOLEAN NOT NULL DEFAULT true,
                CONSTRAINT fk_login_funcionario FOREIGN KEY (id_funcionario)
                    REFERENCES public.funcionario (id_funcionario)
            );

            -- PEDIDO;
            CREATE TABLE IF NOT EXISTS public.pedido
            (
                id_pedido SERIAL PRIMARY KEY,
                id_mesa INTEGER NOT NULL,
                id_cardapio INTEGER NOT NULL,
                quantidade INTEGER NOT NULL CHECK (quantidade > 0),
                observacao TEXT,
                id_garcom INTEGER NOT NULL,
                estado_pedido VARCHAR(50) NOT NULL,
                data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
                hora_pedido TIME NOT NULL DEFAULT CURRENT_TIME,
                CONSTRAINT fk_pedido_garcom FOREIGN KEY (id_garcom)
                    REFERENCES public.funcionario (id_funcionario),
                CONSTRAINT fk_pedido_cardapio FOREIGN KEY (id_cardapio)
                    REFERENCES public.cardapio (id_cardapio),
                CONSTRAINT fk_pedido_mesa FOREIGN KEY (id_mesa)
                    REFERENCES public.mesa (id_mesa)
            );

            -- PAGAMENTO;
            CREATE TABLE IF NOT EXISTS public.pagamento
            (
                id_pagamento SERIAL PRIMARY KEY,
                id_mesa INTEGER NOT NULL,
                estado_pagamento VARCHAR(50) NOT NULL,
                id_pedido INTEGER NOT NULL,
                valor_total NUMERIC(10,2) NOT NULL,
                meio_pagamento VARCHAR(50) NOT NULL,
                data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
                hora_pagamento TIME NOT NULL DEFAULT CURRENT_TIME,
                CONSTRAINT fk_pagamento_mesa FOREIGN KEY (id_mesa)
                    REFERENCES public.mesa (id_mesa),
                CONSTRAINT fk_pagamento_pedido FOREIGN KEY (id_pedido)
                    REFERENCES public.pedido (id_pedido)
            );

            -- CHECK-IN;
            CREATE TABLE IF NOT EXISTS public.checkin
            (
                id_checkin SERIAL PRIMARY KEY,
                checkin BOOLEAN NOT NULL,
                checkout BOOLEAN NOT NULL,
                id_mesa INTEGER NOT NULL,
                CONSTRAINT fk_checkin_mesa FOREIGN KEY (id_mesa)
                    REFERENCES public.mesa (id_mesa)
            );

            COMMIT;
        `);

    } catch (error) {
        console.error("# Erro ao verificar/criar tabelas: ", error);
    }
}

export default initdb;