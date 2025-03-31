import UsuarioModel from "../models/UsuarioModel";
import { authentication, random } from "../helpers";

interface AuthDTO {
    cpf: string,
    senha: string,
    idFuncionario: any,
}

class AuthenticationService {
    static async login({ cpf, senha }: AuthDTO) {
        try {
            if (!cpf || !senha ) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const usuario = await UsuarioModel.buscarUsuarioPorCpf(cpf);

            if (!usuario) { // Usuário incorreto
                throw { statusCode: 400, message: "Usuário ou senha incorretos"}
            };

            const hash = authentication(usuario.salt, senha);
            if (usuario.senha !== hash) { // Senha incorreta
                throw { statusCode: 400, message: "Usuário ou senha incorretos"}
            }

            const usuarioId = usuario.idlogin;
            const salt = random();

            const tokenAutenticacao = authentication(salt, usuarioId)

            await UsuarioModel.login(usuarioId, tokenAutenticacao);
            
            return tokenAutenticacao;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async registrar({ cpf, senha, idFuncionario }: AuthDTO) {
        try {
            if (!cpf || !senha || !idFuncionario) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const cpfFormatado = cpf.replace(/[\.-]/g, "");
            const salt = random();
            const senhaFormatada = authentication(salt, senha);

            const result = await UsuarioModel.adicionarUsuario(cpfFormatado, senhaFormatada, salt, idFuncionario);

            return result;
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