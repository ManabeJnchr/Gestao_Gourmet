import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class AdicionalModel {
    
    static async listarAdicionais(id_itemcardapio: any) {
        try {
            const result = await pool.query(
                `SELECT id_adicional, id_itemcardapio, nome, valor
                 FROM adicional 
                 WHERE id_itemcardapio = $1 AND ativo = true
                 ORDER BY id_adicional ASC`,
                 [ id_itemcardapio]
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar adicionais do item, tente novamente"};
        }
    }

    static async novoAdicional(nome: any, valor: number, id_itemcardapio: any, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO adicional (nome, valor, id_itemcardapio)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                 [nome, valor, id_itemcardapio]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao criar adicional do item, tente novamente"};
        }
    }

    static async atualizarAdicional(id_adicional: number, nome: any, valor: number, client : PgClient =pool) {
        try {
            const result = await client.query(
                `UPDATE adicional 
                 SET nome = $1, valor = $2
                 WHERE id_adicional = $3
                 RETURNING *
                `,
                 [nome, valor, id_adicional]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao atualizar adicional, tente novamente"};
        }
    }

    static async deletarAdicional(id_adicional: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `UPDATE adicional 
                 SET ativo = false
                 WHERE id_adicional = $1
                 RETURNING *`,
                 [id_adicional]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao deletar adicional do item, tente novamente"};
        }
    }

    static async buscarAdicional(id_adicional: number) {
        try {
            const result = await pool.query(
                `SELECT id_adicional, id_itemcardapio, nome, valor
                 FROM adicional 
                 WHERE id_adicional = $1 AND ativo = true
                `,
                 [ id_adicional]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao buscar adicional, tente novamente"};
        }
    }
}

export default AdicionalModel;