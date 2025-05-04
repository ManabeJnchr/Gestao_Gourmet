import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class ItemPedidoModel {
    
    static async listarItensDoPedido(id_pedido: number) {
        try {
            const result = await pool.query(
                `SELECT 
                 ip.id_itempedido, ip.id_pedido, ip.id_itemcardapio, ip.quantidade, ip.valor, ip.observacao,
                 i.nome, i.id_categoria, i.descricao, i.imagem
                 FROM itempedido AS ip
                 LEFT JOIN itemcardapio AS i ON ip.id_itemcardapio = i.id_itemcardapio
                 WHERE id_pedido = $1
                 ORDER BY id_itempedido ASC`,
                 [id_pedido]
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar itens do pedido, tente novamente"};
        }
    }

    static async adicionarItemPedido(id_pedido: number, id_itemcardapio: number, quantidade: number, valor: number, observacao: string, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO itempedido (id_pedido, id_itemcardapio, quantidade, valor, observacao)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                 [id_pedido, id_itemcardapio, quantidade, valor, observacao]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao adicionar item ao pedido, tente novamente"};
        }
    }

    static async atualizarItemPedido(id_itempedido: number, quantidade: number, observacao: string, valor: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `UPDATE itempedido
                 SET quantidade = $1, observacao = $2, valor = $3
                 WHERE id_itempedido = $4
                 RETURNING *
                `,
                 [quantidade, observacao, valor, id_itempedido]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao atualizar item do pedido, tente novamente"};
        }
    }

    static async removerItemPedido(id_itempedido: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `DELETE FROM itempedido
                 WHERE id_itempedido = $1
                `,
                [id_itempedido]
            )


            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao deletar pedido, tente novamente"};
        }
    }
}

export default ItemPedidoModel;