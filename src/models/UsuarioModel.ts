import pool from "../database/index"

class UsuarioModel {

    static async adicionarUsuario(cpf: string, senha: any, salt: string, idFuncionario: number) {
        try {
            const result = await pool.query(`
                INSERT INTO login (usuario, senha, salt, idfuncionario) 
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [cpf, senha, salt, idFuncionario]);

            return result.rows;

        } catch (err) {
            console.error("Erro ao cadastrar usuário", err);
            throw new Error("Erro ao cadastrar usuário, tente novamente.")
        }
    }

    static async buscarUsuarioPorCpf(cpf: string) {
        try {
            const result = await pool.query(`
                SELECT * FROM login 
                WHERE usuario = $1;
                `, [cpf]);

            return result.rows[0];

        } catch (err) {
            console.error("Erro ao buscar usuário", err);
            throw new Error("Erro ao buscar usuário, tente novamente.")
        }
    }

    static async login (usuarioId:string, authToken:any) {
        try {
            const result = await pool.query(`
                UPDATE login 
                SET sessionToken = $1
                WHERE idlogin = $2;
                `, [authToken, usuarioId]);

            return result.rows[0];

        } catch (err) {
            console.error("Erro ao atualizar usuário", err);
            throw new Error("Erro ao atualizar usuário, tente novamente.")
        }
    }

}

export default UsuarioModel