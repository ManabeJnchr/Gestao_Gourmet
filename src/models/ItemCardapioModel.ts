import pool from "../database/index";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

class ItemCardapioModel {
    
    static async listarCardapio() {
        try {
            const result = await pool.query(
                `SELECT i.id_itemcardapio, i.nome, i.valor, i.id_categoria, i.descricao, i.imagem
                 FROM itemcardapio i
                 LEFT JOIN categoria c ON c.id_categoria = i.id_categoria
                 ORDER BY i.id_itemcardapio ASC`
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar itens do cardápio, tente novamente"};
        }
    }

    static async adicionarItemCardapio(nome: any, valor: number, id_categoria: number, descricao: any, imagem: any, client : PgClient = pool) {
        try {
            const result = await client.query(
                `INSERT INTO itemcardapio (nome, valor, id_categoria, descricao, imagem)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                 [nome, valor, id_categoria, descricao, imagem]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao adicionar item ao cardápio, tente novamente"};
        }
    }

    static async atualizarItemCardapio(id_itemcardapio: number, nome: any, valor: number, id_categoria: number, descricao: any, imagem: any, client : PgClient =pool) {
        try {
            const resultUpdate = await client.query(
                `UPDATE itemcardapio 
                 SET nome = $1, valor = $2, id_categoria = $3, descricao = $4, imagem = $5
                 WHERE id_itemcardapio = $6
                 RETURNING *
                `,
                 [nome, valor, id_categoria, descricao, imagem, id_itemcardapio]
            );

            const result = await client.query(
                `SELECT i.id_itemcardapio, i.nome, i.valor, i.id_categoria, i.descricao, i.imagem
                 FROM itemcardapio i
                 LEFT JOIN categoria c ON c.id_categoria = i.id_categoria
                 WHERE i.id_itemcardapio = $1`,
                 [id_itemcardapio]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao atualizar item do cardápio, tente novamente"};
        }
    }

    static async deletarItemCardapio(id_itemcardapio: number, client : PgClient = pool) {
        try {
            const result = await client.query(
                `DELETE FROM itemcardapio 
                 WHERE id_itemcardapio = $1`,
                 [id_itemcardapio]
            );

            return result;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao deletar item do cardápio, tente novamente"};
        }
    }
}

export default ItemCardapioModel;