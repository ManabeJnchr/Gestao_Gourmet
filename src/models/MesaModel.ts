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

            return result;
        } catch (err: any) {
            console.error("Erro no model", err);
            throw {statusCode:500, message:"Erro ao listar mesas, tente novamente"};
        }
    }

    static async adicionarFuncionario(cpf: string, id_cargo: number, nome: string, telefone: string, imagePath: string) {
        try {
            const result = await pool.query(`
                INSERT INTO funcionario (nome, cpf, id_cargo, telefone, imagem) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `, [nome, cpf, id_cargo, telefone, imagePath]);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao cadastrar funcionário", err);
            throw new Error("Erro ao cadastrar funcionário, tente novamente.");
        }
    }

    static async atualizarFuncionario(id_funcionario: number, cpf: string, id_cargo: number, nome: string, telefone: string, imagePath: string | null) {
        try {
            let query: string;
            let values: any[];

            if (imagePath !== null) {
                query = `
                    UPDATE funcionario
                    SET nome = $1, cpf = $2, id_cargo = $3, telefone = $4, imagem = $5
                    WHERE id_funcionario = $6
                    RETURNING *
                `;
                values = [nome, cpf, id_cargo, telefone, imagePath, id_funcionario];
            } else {
                query = `
                    UPDATE funcionario
                    SET nome = $1, cpf = $2, id_cargo = $3, telefone = $4
                    WHERE id_funcionario = $5
                    RETURNING *
                `;
                values = [nome, cpf, id_cargo, telefone, id_funcionario];
            }

            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao atualizar funcionário", err);
            throw new Error("Erro ao atualizar funcionário, tente novamente.");
        }
    }

    static async deletarFuncionario(id_funcionario: any) {
        try {
            const deleteLogin = await pool.query(`
                DELETE FROM login
                WHERE id_funcionario = $1;
            `, [id_funcionario]);

            const deleteFuncionario = await pool.query(`
                DELETE FROM funcionario
                WHERE id_funcionario = $1;
            `, [id_funcionario]);


            return deleteFuncionario.rows[0];
        } catch (err) {
            console.error("Erro ao deletar funcionário", err);
            throw new Error("Erro ao deletar funcionário, tente novamente.");
        }
    }

}

export default MesaModel;