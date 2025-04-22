import AdicionalModel from "../models/AdicionalModel";
import { Pool, PoolClient } from "pg";

type PgClient = Pool | PoolClient;

interface adicionalDTO {
    id_adicional?: any,
    id_itemcardapio?: string,
    nome?: any,
    valor?: any,
}

class AdicionaisService {

    static async listarAdicionais ({id_itemcardapio}: adicionalDTO) {
        try {

            const result = await AdicionalModel.listarAdicionais(id_itemcardapio)

            return result;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async novoAdicional ({nome, valor, id_itemcardapio}: adicionalDTO, client : PgClient) {
        try {

            if (!nome || !valor) {
                throw { statusCode: 400, message: "Algum argumento está faltando" }
            }

            const nomeFormatado = nome.trim();
            if (!nomeFormatado) {
                throw { statusCode: 400, message: "Especifique um nome válido para o adicional" }
            }
            
            const numero_valor = Number(valor);
            if (isNaN(numero_valor)) {
                throw { statusCode: 400, message: "Especifique um valor válido para o adicional" }
            }

            const result = await AdicionalModel.novoAdicional(nome, valor, id_itemcardapio, client)

            return result;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async atualizarAdicional ({nome, valor, id_adicional}: adicionalDTO, client : PgClient) {
        try { 

            if (!nome || !valor) {
                throw { statusCode: 400, message: "Algum argumento está faltando" }
            }

            const nomeFormatado = nome.trim();
            if (!nomeFormatado) {
                throw { statusCode: 400, message: "Especifique um nome válido para o adicional" }
            }
            
            const numero_valor = Number(valor);
            if (isNaN(numero_valor)) {
                throw { statusCode: 400, message: "Especifique um valor válido para o adicional" }
            }

            const result = await AdicionalModel.atualizarAdicional(id_adicional, nome, valor, client)

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async deletarAdicional({id_adicional} : adicionalDTO, client : PgClient) {
        try {

            if (!id_adicional) {
                throw { statusCode: 400, message: "ID do item não especificado" }
            }
            
            const numero_id_adicional = Number(id_adicional);
            
            if (isNaN(numero_id_adicional)) {
                throw { statusCode: 400, message: "ID do adicional inválido" }
            }

            const result = await AdicionalModel.deletarAdicional(numero_id_adicional, client)

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

export default AdicionaisService;