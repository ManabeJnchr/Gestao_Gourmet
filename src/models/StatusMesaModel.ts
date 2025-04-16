import pool from "../database/index";

class StatusMesaModel {
    static async listarStatusMesa() {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM mesastatus
                 `
            );

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar status, tente novamente"};
        }
    }

    static async buscarStatusPorId(id_status : Number) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM mesastatus
                 WHERE id_status = $1
                 `, [id_status]
            );

            return result.rows[0];
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao buscar status, tente novamente"};
        }
    }

}

export default StatusMesaModel;