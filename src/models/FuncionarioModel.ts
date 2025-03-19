import pool from "../database/index"

class FuncionarioModel {
    static async listarFuncionarios () {
        try {
            const result = await pool.query(
                `SELECT f.idfuncionario, f.nome, f.cpf, f.idcargo, c.nome cargo, f.telefone 
                FROM funcionario f 
                LEFT JOIN cargo c on c.idcargo = f.idcargo 
                ORDER BY f.nome, cargo asc`);
    
            return {result:result.rows}
        } catch (err: any) {
            console.error("Erro ao listar funcionários", err);
            throw new Error("Erro ao listar funcionários, tente novamente")
        }
    }

    static async adicionarFuncionario ( cpf:string, cargo:number, nome:string, telefone:string) 
    {
        try {
            const result = await pool.query(`
                INSERT INTO funcionario (nome, cpf, idcargo, telefone) 
        
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [nome, cpf, cargo, telefone]);
    
            return {mensagem: "Funcionário cadastrado com sucesso", result:result.rows};

        } catch (err) {
            console.error("Erro ao cadastrar funcionário", err);
            throw new Error("Erro ao cadastrar funcionário, tente novamente.")

        }
    }

    static async atualizarFuncionario ( id:number, cpf:string, cargo:number, nome:string, telefone:string) 
    {
        try {
            const result = await pool.query(`
                UPDATE funcionario
                SET nome = $1, cpf = $2, idcargo = $3, telefone = $4
                WHERE idfuncionario = $5
                RETURNING *
            `, [nome, cpf, cargo, telefone, id]);
    
            return {mensagem: "Funcionário atualizado com sucesso", result:result.rows};

        } catch (err) {
            console.error("Erro ao atualizar funcionário", err);
            throw new Error("Erro ao atualizar funcionário, tente novamente.")
    
        }
    }

    static async deletarFuncionario (id:any) {
        try {
            const result = await pool.query(`
                DELETE FROM funcionario
                WHERE idfuncionario = $1
                RETURNING *;
                `, 
                [id]);

            return {mensagem: "Funcionário deletado com sucesso", result:result.rows};
        } catch (err) {
            console.error("Erro ao deletar funcionário", err);
            throw new Error("Erro ao deletar funcionário, tente novamente.")
    

        }
    }

}

export default FuncionarioModel