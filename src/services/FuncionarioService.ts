import FuncionarioModel from "../models/FuncionarioModel";
import AuthenticationService from "./AuthenticationService";

interface FuncionarioDTO {
    cargo: any,
    cpf: string,
    id: any,
    nome: string,
    telefone: string,
    imagem?: string
}

class FuncionarioService {
    static async salvarFuncionario({ id, cpf, cargo, nome, telefone, imagem }: FuncionarioDTO) {
        try {
            if (!cargo || !cpf || !id || !nome || !telefone) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            if (isNaN(Number(cargo)) || isNaN(Number(id))) {
                throw { statusCode: 400, message: "Argumento inválido" }
            }

            if ((id == -1)) {
                const result = await FuncionarioModel.adicionarFuncionario(cpf, cargo, nome, telefone, imagem);

                const idFuncionario = result.idfuncionario;
                const senha = cpf;
                const login = await AuthenticationService.registrar({cpf, senha, idFuncionario});

                return result;
            } else {
                return await FuncionarioModel.atualizarFuncionario(id, cpf, cargo, nome, telefone, imagem);
            }

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async listarFuncionarios() {
        try {
            return await FuncionarioModel.listarFuncionarios();

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, mensagem: "Erro interno no servidor" }
        }

    }

    static async deletarFuncionario({ id }: FuncionarioDTO) {
        try {

            if (!id || isNaN(Number(id))) {
                throw { statusCode: 400, message: "Argumento inválido" }
            }

            return await FuncionarioModel.deletarFuncionario(id);
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, mensagem: "Erro interno no servidor" }
        }
    }
}

export default FuncionarioService