import MesaModel from "../models/MesaModel";

interface MesaDTO {
    id_mesa: any,
    numero_mesa: any,
    qtd_lugares: any,
}

class FuncionarioService {
    static async salvarMesa({ id_mesa, numero_mesa, qtd_lugares }: MesaDTO) {
        try {
            if (!id_mesa || !numero_mesa || !qtd_lugares) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const number_id_mesa = Number(id_mesa);
            if (isNaN(number_id_mesa)) {
                throw { statusCode: 400, message: "ID inválido" }
            }
            
            const number_qtd_lugares = Number(qtd_lugares)
            if (isNaN(number_qtd_lugares) || number_qtd_lugares < 1) {
                throw { statusCode: 400, message: "Quantidade de lugares inválida" }
            }

            if (id_mesa === -1) { // Nova mesa

            } else { // Atualizar mesa

            }

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async listarMesas() {
        try {
            return await MesaModel.listarMesas();
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    // static async deletarFuncionario(id_funcionario : any) {
    //     try {
    //         if (!id_funcionario || isNaN(Number(id_funcionario))) {
    //             throw { statusCode: 400, message: "Argumento inválido" }
    //         }

    //         return await FuncionarioModel.deletarFuncionario(id_funcionario);
    //     } catch (err: any) {
    //         console.error("Erro no service: ", err);

    //         if (err.statusCode) {
    //             throw err;
    //         }

    //         throw { statusCode: 500, message: "Erro interno no servidor" }
    //     }
    // }

}

export default FuncionarioService;