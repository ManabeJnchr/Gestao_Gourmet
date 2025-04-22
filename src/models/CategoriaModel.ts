import pool from "../database/index";

class CategoriaModel {
    static async listarCategorias() {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM categoria
                 ORDER BY nome ASC
                 `
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar categorias, tente novamente"};
        }
    }

    static async buscarCategoriaPorId(id_categoria : Number) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM categoria
                 WHERE id_categoria = $1
                 `, [id_categoria]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao buscar categoria, tente novamente"};
        }
    }

    static async buscarCategoriaPorNome(nome : String) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM categoria
                 WHERE nome = $1
                 `, [nome]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao buscar categoria, tente novamente"};
        }
    }

}

export default CategoriaModel;