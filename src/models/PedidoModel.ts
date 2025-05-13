import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class PedidoModel {
    
    static async listarPedidos() {
        try {
            const result = await pool.query(
                `SELECT id_pedido, id_mesa, observacao, id_funcionario, id_statuspedido, data_pedido
                 FROM pedido
                 ORDER BY id_pedido DESC`
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar pedidos, tente novamente"};
        }
    }

    static async buscarPedidoMesa(id_mesa: number) {
        try {
            const result = await pool.query(
                `SELECT id_pedido, id_mesa, observacao, id_funcionario, id_statuspedido, data_pedido
                 FROM pedido
                 WHERE id_mesa = $1 AND id_statuspedido IN ('1','2')
                 ORDER BY id_pedido DESC`, // Pedidos com status "aberto" ou "fechado"
                [id_mesa]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar pedidos, tente novamente"};
        }
    }

    static async adicionarPedido(id_mesa: number, observacao: string, id_funcionario: number, id_statuspedido: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO pedido (id_mesa, observacao, id_funcionario, id_statuspedido)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                 [id_mesa, observacao, id_funcionario, id_statuspedido]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao criar pedido, tente novamente"};
        }
    }

    static async atualizarPedido(id_pedido: number, id_mesa: number, observacao: string, id_funcionario: number, id_statuspedido: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `UPDATE pedido
                 SET id_mesa = $1, observacao = $2, id_funcionario = $3, id_statuspedido = $4
                 WHERE id_pedido = $5
                 RETURNING *
                `,
                 [id_mesa, observacao, id_funcionario, id_statuspedido, id_pedido]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao atualizar pedido, tente novamente"};
        }
    }

    static async deletarPedido(id_pedido: number, client : PgClient = pool) {
        try {
            // TODO: vai deletar ou setar status como desativo?

            return true;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao deletar pedido, tente novamente"};
        }
    }

    static async buscarPedido(id_pedido: number) {
        try {
            const result = await pool.query(
                `SELECT id_pedido, id_mesa, observacao, id_funcionario, id_statuspedido, data_pedido
                 FROM pedido
                 WHERE id_pedido = $1
                 ORDER BY id_pedido DESC`,
                [id_pedido]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar pedidos, tente novamente"};
        }
    }


}

export default PedidoModel;