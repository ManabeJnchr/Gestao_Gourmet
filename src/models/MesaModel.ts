import pool from "../database/index";

class MesaModel {

    
    static async listarMesas() {
        try {
            const result = await pool.query(
                `SELECT m.id_mesa, m.numero_mesa, m.qtd_lugares, sm.status 
                 FROM mesa m
                 LEFT JOIN statusmesa sm ON sm.id_status = m.id_status 
                 ORDER BY m.id_mesa ASC`
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
}

export default MesaModel;