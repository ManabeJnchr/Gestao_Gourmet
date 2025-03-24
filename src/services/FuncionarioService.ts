import FuncionarioModel from "../models/FuncionarioModel";
import path from 'path';

interface FuncionarioDTO {
    cargo: any,
    cpf: string,
    id?: any,
    nome: string,
    telefone: string,
    imagePath?: string | null // Update this line
}

class FuncionarioService {
    static async salvarFuncionario({ id, cpf, cargo, nome, telefone, imagePath }: FuncionarioDTO) {
        try {
            if (!cargo || !cpf || !nome || !telefone) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            if (isNaN(Number(cargo)) || (id !== undefined && isNaN(Number(id)))) {
                throw { statusCode: 400, message: "Argumento inválido" }
            }

            if (id === -1) {
                return await FuncionarioModel.adicionarFuncionario(cpf, cargo, nome, telefone, imagePath || '');
            } else {
                const funcionario = await FuncionarioModel.atualizarFuncionario(id, cpf, cargo, nome, telefone, imagePath !== undefined ? imagePath : await this.getFuncionarioImagePath(id));
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

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async getFuncionarioImagePath(id: any) {
        try {
            const result = await FuncionarioModel.getFuncionarioImage(id);
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