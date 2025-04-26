import FuncionarioModel from "../models/FuncionarioModel";
import path from 'path';
import AuthenticationService from "./AuthenticationService";
import UsuarioModel from "../models/UsuarioModel";

interface FuncionarioDTO {
    id_cargo: any,
    cpf: string,
    id_funcionario?: any,
    nome: string,
    telefone: string,
    imagePath?: string | null // Update this line
}

class FuncionarioService {
    static async salvarFuncionario({ id_funcionario, cpf, id_cargo, nome, telefone, imagePath }: FuncionarioDTO) {
        try {
            if (!id_cargo || !cpf || !nome || !telefone) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            if (isNaN(Number(id_cargo)) || (id_funcionario !== undefined && isNaN(Number(id_funcionario)))) {
                throw { statusCode: 400, message: "Argumento inválido" }
            }

            if (id_funcionario === -1) {
                const result = await FuncionarioModel.adicionarFuncionario(cpf, id_cargo, nome, telefone, imagePath || '');

                const senha = cpf.replace(/[\.-]/g, "");;
                const id_funcionario = result.id_funcionario;
                const account = await AuthenticationService.registrar({ cpf, senha, id_funcionario });

                return result;
            } else {
                const funcionario = await FuncionarioModel.atualizarFuncionario(id_funcionario, cpf, id_cargo, nome, telefone, imagePath !== undefined ? imagePath : await this.getFuncionarioImagePath(id_funcionario));

                const cpfFormatado = cpf.replace(/[\.-]/g, "");
                await UsuarioModel.atualizarCPF(id_funcionario, cpfFormatado);

                return {
                    ...funcionario,
                    imagem: funcionario.imagem ? funcionario.imagem : null // Ensure the image path is correct
                };
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

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async deletarFuncionario(id_funcionario : any) {
        try {
            if (!id_funcionario || isNaN(Number(id_funcionario))) {
                throw { statusCode: 400, message: "Argumento inválido" }
            }

            return await FuncionarioModel.deletarFuncionario(id_funcionario);
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async getFuncionarioImagePath(id_funcionario: any) {
        try {
            const result = await FuncionarioModel.getFuncionarioImage(id_funcionario);
            if (result) {
                return result.imagem; // Return only the image name
            }
            return null;
        } catch (err: any) {
            console.error("Erro no service: ", err);
            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }
}

export default FuncionarioService;