import UsuarioModel from "../models/UsuarioModel";
import { authentication, random } from "../helpers";

interface AuthDTO {
    cpf: string,
    senha: string,
    id_funcionario: any,
}

class AuthenticationService {
    static async login({ cpf, senha }: AuthDTO) {
        try {
            if (!cpf || !senha ) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const cpfFormatado = cpf.replace(/[\.-]/g, "");

            const usuario = await UsuarioModel.buscarUsuarioPorCpf(cpfFormatado);

            if (!usuario) { // Usuário incorreto
                throw { statusCode: 400, message: "Usuário ou senha incorretos"}
            };

            const hash = authentication(usuario.salt, senha);
            if (usuario.senha !== hash) { // Senha incorreta
                throw { statusCode: 400, message: "Usuário ou senha incorretos"}
            }

            const id_usuario = usuario.id_login;
            const salt = random();

            const tokenAutenticacao = authentication(salt, id_usuario)

            await UsuarioModel.login(id_usuario, tokenAutenticacao);
            
            return tokenAutenticacao;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async registrar({ cpf, senha, id_funcionario }: AuthDTO) {
        try {
            if (!cpf || !senha || !id_funcionario) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const cpfFormatado = cpf.replace(/[\.-]/g, "");
            const salt = random();
            const senhaFormatada = authentication(salt, senha);

            const result = await UsuarioModel.adicionarUsuario(cpfFormatado, senhaFormatada, salt, id_funcionario);

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async getIdentity (authToken: string) {
        try {
            if (!authToken) { // If there is no authToken, then identity is empty
                return {}
            }

            const result = await UsuarioModel.buscarUsuarioPorAuthToken(authToken);

            if (!result) {
                return {};
            }

            return result;
            
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async solicitarResetSenha ({cpf}: AuthDTO) {
        try {
            const cpfFormatado = cpf.replace(/[\.-]/g, "");

            const verificarUsuario = await UsuarioModel.buscarUsuarioPorCpf(cpfFormatado);

            if (!verificarUsuario) {
                throw { statusCode: 400, message: "Usuário inexistente"}
            }
            
            await UsuarioModel.solicitarResetSenha(verificarUsuario.id_login);

            return { message: "Solicitação enviada com sucesso" };

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async aceitarResetSenha ({cpf}: AuthDTO) {
        try {
            if (!cpf) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const cpfFormatado = cpf.replace(/[\.-]/g, "");
            const verificarUsuario = await UsuarioModel.buscarUsuarioPorCpf(cpfFormatado);

            if (!verificarUsuario || !verificarUsuario.redefinir_senha) {
                throw { statusCode: 400, message: "Usuário inexistente ou inválido"}
            }

            const salt = random();
            const senhaFormatada = authentication(salt, cpfFormatado);

            await UsuarioModel.aceitarResetSenha(verificarUsuario.id_login, senhaFormatada, salt);
            
            return { message: "Senha reiniciada com sucesso" };
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async trocarSenha ({senha}: AuthDTO, authToken: string) {
        try {
            if (!senha) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            if (!authToken) {
                throw { statusCode: 400, message: "Não autorizado. Faça login novamente."}
            }

            const verificarAuth = await UsuarioModel.buscarUsuarioPorAuthToken(authToken);
            
            if (!verificarAuth) {
                throw { statusCode: 400, message: "Não autorizado. Faça login novamente."}
            }

            const salt =  random();
            const senhaFormatada = authentication(salt, senha);

            console.log(verificarAuth);
            await UsuarioModel.trocarSenha(verificarAuth.id_login, senhaFormatada, salt);
            
            return { message: "Senha atualizada com sucesso" };
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async listarSolicitacoesResetSenha () {
        try {
            const result = await UsuarioModel.listarSolicitacoesResetSenha();

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async recusarResetSenha ({cpf}: AuthDTO) {
        try {
            if (!cpf) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const cpfFormatado = cpf.replace(/[\.-]/g, "");
            const verificarUsuario = await UsuarioModel.buscarUsuarioPorCpf(cpfFormatado);

            if (!verificarUsuario || !verificarUsuario.redefinir_senha) {
                throw { statusCode: 400, message: "Usuário inexistente ou inválido"}
            }

            await UsuarioModel.recusarResetSenha(verificarUsuario.id_login);
            
            return { message: "Reset de senha recusado" };
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async quantidadeSolicitacoesResetSenha () {
        try {
            const result = await UsuarioModel.quantidadeSolicitacoesResetSenha();

            return {quantidade:result};
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }



}

export default AuthenticationService