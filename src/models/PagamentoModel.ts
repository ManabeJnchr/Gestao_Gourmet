import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class PagamentoModel {
    
    static async listarPagamentosPedido(id_pedido: number) {
        try {
            const result = await pool.query(
                `SELECT p.id_pagamento, p.id_pedido, p.id_meiopagamento, mp.nome AS nome_meiopagamento, valor_pagamento, data_pagamento, hora_pagamento
                 FROM pedido AS p LEFT JOIN meiopagamento AS mp ON mp.id_meiopagamento = p.id_meiopagamento
                 WHERE p.id_pedido = $1
                 ORDER BY id_pagamento ASC`, 
                [id_pedido]
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar pagamentos, tente novamente"};
        }
    }

    static async buscarPagamento(id_pagamento: number) {
        try {
            const result = await pool.query(
                `SELECT p.id_pagamento, p.id_pedido, p.id_meiopagamento, mp.nome AS nome_meiopagamento, valor_pagamento, data_pagamento, hora_pagamento
                 FROM pedido AS p LEFT JOIN meiopagamento AS mp ON mp.id_meiopagamento = p.id_meiopagamento
                 WHERE p.id_pagamento = $1`, 
                [id_pagamento]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao buscar pagamento, tente novamente"};
        }
    }

    static async adicionarPagamento(id_pedido: number, id_meiopagamento: string, valor_pagamento: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO pagamento (id_pedido, id_meiopagamento, valor_pagamento)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [id_pedido, id_meiopagamento, valor_pagamento]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao criar pagamento, tente novamente"};
        }
    }

}

export default PagamentoModel;