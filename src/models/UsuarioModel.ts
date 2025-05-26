import pool from "../database/index"

class UsuarioModel {

    static async adicionarUsuario(cpf: string, senha: any, salt: string, id_funcionario: number) {
        try {
            const result = await pool.query(`
                INSERT INTO login (cpf, senha, salt, id_funcionario) 
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [cpf, senha, salt, id_funcionario]);

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
                WHERE cpf = $1;
                `, [cpf]);
                
            return result.rows[0];

        } catch (err) {
            console.error("Erro ao buscar usuário", err);
            throw new Error("Erro ao buscar usuário, tente novamente.")
        }
    }

    static async buscarUsuarioPorAuthToken(authToken: string) {
        try {
            const result = await pool.query(`
                SELECT login.id_login, login.cpf, f.id_funcionario, f.nome AS funcionarionome, f.cpf AS funcionario_cpf, f.id_cargo, f.imagem, c.nome AS cargonome
                FROM login 
                LEFT JOIN funcionario AS f ON login.id_funcionario = f.id_funcionario
                LEFT JOIN cargo AS c ON f.id_cargo = c.id_cargo
                WHERE login.session_token = $1;
            `, [authToken]);
            return result.rows[0];

        } catch (err) {
            console.error("Erro ao buscar usuário", err);
            throw new Error("Erro ao buscar usuário, tente novamente.")
        }
    }

    static async login (id_usuario:string, authToken:any) {
        try {
            const result = await pool.query(`
                UPDATE login 
                SET session_token = $1
                WHERE id_login = $2;
            `, [authToken, id_usuario]);

            return result.rows[0];

        } catch (err) {
            console.error("Erro ao atualizar usuário", err);
            throw new Error("Erro ao atualizar usuário, tente novamente.")
        }
    }

    static async solicitarResetSenha (id_usuario:string) {
        try {
            const result = await pool.query(`
                UPDATE login 
                SET redefinir_senha = true
                WHERE id_login = $1
                RETURNING *;
            `, [id_usuario]);

            return result.rows[0];

        } catch (err) {
            console.error("Erro ao atualizar usuário", err);
            throw new Error("Erro ao atualizar usuário, tente novamente.")
        }
    }

    static async aceitarResetSenha (id_usuario:string, senha:string, salt:string) {
        try {
            const result = await pool.query(`
                UPDATE login 
                SET redefinir_senha = false, primeiro_login = true, senha = $1, salt = $2
                WHERE id_login = $3
                RETURNING *;
            `, [senha, salt, id_usuario]);

            return result.rows[0];

        } catch (err) {
            console.error("Erro ao atualizar usuário", err);
            throw new Error("Erro ao atualizar usuário, tente novamente.")
        }
    }

    static async trocarSenha (id_usuario:string, senha:string, salt:string) {
        try {
            const result = await pool.query(`
                UPDATE login 
                SET primeiro_login = false, senha = $1, salt = $2
                WHERE id_login = $3
                RETURNING *;
                `, [senha, salt, id_usuario]);
                
                
                return result.rows[0];
                
            } catch (err) {
                console.error("Erro ao atualizar usuário", err);
                throw new Error("Erro ao atualizar usuário, tente novamente.")
            }
        }
        
        static async listarSolicitacoesResetSenha () {
            try {
                const result = await pool.query(`
                    SELECT login.id_login, login.cpf, f.nome AS funcionario_nome, f.cpf AS funcionario_cpf, f.telefone AS funcionario_telefone, f.id_cargo, c.nome AS cargo_nome 
                    FROM login 
                    LEFT JOIN funcionario AS f ON login.id_funcionario = f.id_funcionario
                    LEFT JOIN cargo AS c ON f.id_cargo = c.id_cargo
                    WHERE redefinir_senha = true;
                    `);
                    
                return result.rows;
                    
            } catch (err) {
                console.error("Erro ao listar solicitações de reset de senha", err);
                throw new Error("Erro ao listar solicitações de reset de senha, tente novamente.")
            }
        }
        
        static async recusarResetSenha (id_usuario:string) {
            try {
                const result = await pool.query(`
                    UPDATE login 
                    SET redefinir_senha = false
                    WHERE id_login = $1
                    RETURNING *;
                `, [id_usuario]);
    
                return result.rows[0];
    
            } catch (err) {
                console.error("Erro ao atualizar usuário", err);
                throw new Error("Erro ao atualizar usuário, tente novamente.")
            }
        }
        
        static async quantidadeSolicitacoesResetSenha () {
            try {
                const result = await pool.query(`
                    SELECT COUNT(*)
                    FROM login
                    WHERE redefinir_senha = true
                `);
    
                return parseInt(result.rows[0].count, 10);
    
            } catch (err) {
                console.error("Erro no model", err);
                throw new Error("Erro ao contar solicitações de reset de senha, tente novamente.")
            }
        }
        
        static async atualizarCPF (id_funcionario:string, cpf:string) {
            try {
                const result = await pool.query(`
                    UPDATE login 
                    SET cpf = $1
                    WHERE id_funcionario = $2
                    RETURNING *;
                `, [cpf, id_funcionario]);
    
                return result.rows[0];
    
            } catch (err) {
                console.error("Erro ao atualizar usuário", err);
                throw new Error("Erro ao atualizar usuário, tente novamente.")
            }
        }
        

}
        
export default UsuarioModel