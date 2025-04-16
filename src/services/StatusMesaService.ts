import StatusMesaModel from "../models/StatusMesaModel";

class StatusMesaService {
    static async buscarStatusMesaPorId(id_status:any) {
        try {

            const number_id_status = Number(id_status)
            if (isNaN(number_id_status)) {
                throw { statusCode: 400, message: "Status inválido ou inexistente" }
            }

            const result = StatusMesaModel.buscarStatusPorId(number_id_status);

            return result

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }
}

export default StatusMesaService;