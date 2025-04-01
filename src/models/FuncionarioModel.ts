import pool from "../database/index";
import path from 'path';

class FuncionarioModel {
    static async listarFuncionarios() {
        try {
            const result = await pool.query(
                `SELECT f.idfuncionario, f.nome, f.cpf, f.idcargo, c.nome cargo, f.telefone, f.imagem 
                FROM funcionario f 
                LEFT JOIN cargo c on c.idcargo = f.idcargo 
                ORDER BY f.nome, cargo asc`);
    
            // Update image path to include 'uploads' directory
            return result.rows.map((row: any) => ({
                ...row,
                imagem: row.imagem ? row.imagem : null
            }));
        } catch (err: any) {
            console.error("Erro ao listar funcionários", err);
            throw new Error("Erro ao listar funcionários, tente novamente");
        }
    }

    static async adicionarFuncionario(cpf: string, cargo: number, nome: string, telefone: string, imagePath: string) {
        try {
            console.log("Dados recebidos para adicionar funcionário:", { nome, cpf, cargo, telefone, imagem }); // Log dos dados recebidos
            const result = await pool.query(`
                INSERT INTO funcionario (nome, cpf, idcargo, telefone, imagem) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `, [nome, cpf, cargo, telefone, imagem]);
            console.log("Resultado da inserção:", result.rows); // Log do resultado da inserção
            console.log("Query de inserção executada com sucesso"); // Log após a execução da query
            return result.rows[0];

        } catch (err) {
            console.error("Erro ao cadastrar funcionário", err);
            throw new Error("Erro ao cadastrar funcionário, tente novamente.")
        }
    }

    static async atualizarFuncionario(id: number, cpf: string, cargo: number, nome: string, telefone: string, imagePath: string | null) {
        try {
            let query: string;
            let values: any[];

            if (imagePath !== null) {
                query = `
                    UPDATE funcionario
                    SET nome = $1, cpf = $2, idcargo = $3, telefone = $4, imagem = $5
                    WHERE idfuncionario = $6
                    RETURNING *
                `;
                values = [nome, cpf, cargo, telefone, imagePath, id];
            } else {
                query = `
                    UPDATE funcionario
                    SET nome = $1, cpf = $2, idcargo = $3, telefone = $4
                    WHERE idfuncionario = $5
                    RETURNING *
                `;
                values = [nome, cpf, cargo, telefone, id];
            }

            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao atualizar funcionário", err);
            throw new Error("Erro ao atualizar funcionário, tente novamente.");
        }
    }

    static async deletarFuncionario(id: any) {
        try {
            console.log("ID recebido para deletar funcionário:", id); // Log do ID recebido
            const result = await pool.query(`
                DELETE FROM funcionario
                WHERE idfuncionario = $1
                RETURNING *;
                `, 
                [id]);
            console.log("Query de deleção executada com sucesso"); // Log após a execução da query
            return result.rows;

        } catch (err) {
            console.error("Erro ao deletar funcionário", err);
            throw new Error("Erro ao deletar funcionário, tente novamente.")
        }
    }

    static async getFuncionarioImage(id: any) {
        try {
            const result = await pool.query(`
                SELECT imagem FROM funcionario
                WHERE idfuncionario = $1
            `, [id]);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao buscar imagem do funcionário", err);
            throw new Error("Erro ao buscar imagem do funcionário, tente novamente.");
        }
    }
}

export default FuncionarioModel;