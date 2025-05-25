import pool from "../database/index";
import { Pool, PoolClient } from "pg";

class RelatorioModel {
    
    static async gerarRelatorio(query : string, values : any[]) {
        try {

            const result = await pool.query(query, values)

            return result.rows;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao gerar relatório, tente novamente"};
        }
    }

}

export default RelatorioModel;