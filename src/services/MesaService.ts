import MesaModel from "../models/MesaModel";
import StatusMesaService from "./StatusMesaService";

interface MesaDTO {
    id_mesa?: any,
    numero_mesa?: any,
    qtd_lugares?: any,
    id_status?: any,
}

class MesaService {
    static async salvarMesa({ id_mesa, numero_mesa, qtd_lugares, id_status=1 }: MesaDTO) {
        try {
            if (!id_mesa || !numero_mesa || !qtd_lugares) {
                throw { statusCode: 400, message: "Algum argumento não foi especificado" }
            }

            const number_id_mesa = Number(id_mesa);
            if (isNaN(number_id_mesa)) {
                throw { statusCode: 400, message: "ID inválido" }
            }
            
            const number_numero_mesa = Number(numero_mesa)
            if (isNaN(number_numero_mesa) || number_numero_mesa < 0) {
                throw { statusCode: 400, message: "Número da mesa inválido" }
            }

            const number_qtd_lugares = Number(qtd_lugares)
            if (isNaN(number_qtd_lugares) || number_qtd_lugares < 1) {
                throw { statusCode: 400, message: "Quantidade de lugares inválida" }
            }

            const number_id_status = Number(id_status)
            if (isNaN(number_id_status)) {
                throw { statusCode: 400, message: "Status inválido ou inexistente" }
            }

            const verifStatus = StatusMesaService.buscarStatusMesaPorId(number_id_status);
            if(!verifStatus) {
                throw { statusCode: 400, message: "Status inválido ou inexistente"}
            }

            if (number_id_mesa === -1) { // Nova mesa
                this.adicionarMesa({ numero_mesa:number_numero_mesa, qtd_lugares:number_qtd_lugares});

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

    static async adicionarMesa ({ numero_mesa, qtd_lugares }: MesaDTO) {
        try {
            return await MesaModel.adicionarMesa(numero_mesa, qtd_lugares, 4); // status 4 = "Aberta"

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

export default MesaService;