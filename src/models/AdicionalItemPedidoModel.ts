import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class AdicionalItemPedidoModel {
    
    static async listarAdicionaisDoItemPedido(id_itempedido: number) {
        try {
            const result = await pool.query(
                `SELECT 
                 ap.id_adicional_itempedido, ap.id_adcional, ap.valor,
                 a.nome
                 FROM adicional_itempedido AS ap
                 LEFT JOIN adicional AS a ON ap.id_adicional = a.id_adicional
                 WHERE id_itempedido = $1
                 ORDER BY ap.id_adicional_itempedido ASC`,
                 [id_itempedido]
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar adicionais do item do pedido, tente novamente"};
        }
    }

    static async novoAdicionalItemPedido(id_itempedido: number, id_adicional: number, valor: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO adicional_itempedido (id_itempedido, id_adicional, valor)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                 [id_itempedido, id_adicional, valor]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao adicionar adicional no item do pedido, tente novamente"};
        }
    }

    static async removerAdicionalItemPedido(id_adicional_itempedido: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `DELETE FROM adicional_itempedido
                 WHERE id_adicional_itempedido = $1
                `,
                [id_adicional_itempedido]
            )


            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao remover adicional do item do pedido, tente novamente"};
        }
    }
}

export default AdicionalItemPedidoModel;