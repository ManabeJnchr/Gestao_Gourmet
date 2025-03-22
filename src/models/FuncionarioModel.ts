import pool from "../database/index"

class FuncionarioModel {
    static async listarFuncionarios() {
        try {
            const result = await pool.query(
                `SELECT f.idfuncionario, f.nome, f.cpf, f.idcargo, c.nome cargo, f.telefone, f.imagem 
                FROM funcionario f 
                LEFT JOIN cargo c on c.idcargo = f.idcargo 
                ORDER BY f.nome, cargo asc`);

            return result.rows
        } catch (err: any) {
            console.error("Erro ao listar funcionários", err);
            throw new Error("Erro ao listar funcionários, tente novamente")
        }
    }

    static async adicionarFuncionario(cpf: string, cargo: number, nome: string, telefone: string, imagem?: string) {
        try {
            console.log("Dados recebidos para adicionar funcionário:", { nome, cpf, cargo, telefone, imagem }); // Log dos dados recebidos
            const result = await pool.query(`
                INSERT INTO funcionario (nome, cpf, idcargo, telefone, imagem) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `, [nome, cpf, cargo, telefone, imagem]);
            console.log("Resultado da inserção:", result.rows); // Log do resultado da inserção
            console.log("Query de inserção executada com sucesso"); // Log após a execução da query
            return result.rows;

        } catch (err) {
            console.error("Erro ao cadastrar funcionário", err);
            throw new Error("Erro ao cadastrar funcionário, tente novamente.")
        }
    }

    static async atualizarFuncionario(id: number, cpf: string, cargo: number, nome: string, telefone: string, imagem?: string) {
        try {
            console.log("Dados recebidos para atualizar funcionário:", { id, nome, cpf, cargo, telefone, imagem }); // Log dos dados recebidos
            const result = await pool.query(`
                UPDATE funcionario
                SET nome = $1, cpf = $2, idcargo = $3, telefone = $4, imagem = $5
                WHERE idfuncionario = $6
                RETURNING *
            `, [nome, cpf, cargo, telefone, imagem, id]);
            console.log("Query de atualização executada com sucesso"); // Log após a execução da query
            return result.rows;

        } catch (err) {
            console.error("Erro ao atualizar funcionário", err);
            throw new Error("Erro ao atualizar funcionário, tente novamente.")
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
}

export default FuncionarioModel