import pool from "../database/index";

class MesaModel {

    
    static async listarMesas() {
        try {
            const result = await pool.query(
                `SELECT m.id_mesa, m.numero_mesa, m.qtd_lugares, sm.status 
                 FROM mesa m
                 LEFT JOIN statusmesa sm ON sm.id_status = m.id_status 
                 ORDER BY m.numero_mesa ASC`
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar mesas, tente novamente"};
        }
    }

    static async adicionarMesa(numero_mesa: Number, qtd_lugares: Number, id_status: Number) {
        try {
            const result = await pool.query(
                `INSERT INTO mesa (numero_mesa, qtd_lugares, id_status)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                 [numero_mesa, qtd_lugares, id_status]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao adicionar mesa, tente novamente"};
        }
    }

    static async atualizarMesa(id_mesa: Number, numero_mesa: Number, qtd_lugares: Number, id_status: Number) {
        try {
            const resultUpdate = await pool.query(
                `UPDATE mesa 
                 SET numero_mesa = $1, qtd_lugares = $2, id_status = $3
                 WHERE id_mesa = $4
                 RETURNING *
                `,
                 [numero_mesa, qtd_lugares, id_status, id_mesa]
            );

            const result = await pool.query(
                `SELECT m.id_mesa, m.numero_mesa, m.qtd_lugares, sm.status 
                 FROM mesa m
                 LEFT JOIN statusmesa sm ON sm.id_status = m.id_status 
                 WHERE m.id_mesa = $1`,
                 [id_mesa]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao atualizar mesa, tente novamente"};
        }
    }
}

export default MesaModel;