import { Pool, PoolClient } from "pg";
import PedidoModel from "../models/PedidoModel";
import MesaService from "./MesaService";
import ItemCardapioService from "./ItemCardapioService";
import AdicionaisService from "./AdicionaisService";
import ItemPedidoModel from "../models/ItemPedidoModel";
import pool from "../database";
import FuncionarioService from "./FuncionarioService";
import AdicionalItemPedidoModel from "../models/AdicionalItemPedidoModel";

type PgClient = Pool | PoolClient;

interface pedidoDTO {
    id_pedido?: any,
    id_mesa?: any,
    observacao?: string,
    id_funcionario?: any,
    id_statuspedido?: any,
    itens: Array<any>
}

class PedidoService {

    static async listarPedidos () {
        try {

            const result = await PedidoModel.listarPedidos()

            return result;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async novoPedido ({id_mesa, observacao="", id_funcionario, id_statuspedido=1, itens}: pedidoDTO) {
        const client = await pool.connect();

        try {
            if (!id_mesa || !id_funcionario || itens.length === 0) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se mesa específica é válida para criar um novo pedido
            const mesa = await MesaService.buscarMesa(id_mesa);
            if (!mesa || mesa.id_status !== 2 ) {
                throw { statusCode: 400, message: "Mesa inválida" }
            }

            // Verificar se funcionário especificado é válido
            const funcionario = await FuncionarioService.buscarFuncionario(id_funcionario);
            if (!funcionario) {
                throw { statusCode: 400, message: "Funcionário inválido" }
            }

            // Inicia a transaction
            await client.query("BEGIN");

            // Cria o pedido
            const resultPedido = await PedidoModel.adicionarPedido(mesa.id_mesa, observacao, funcionario.id_funcionario, id_statuspedido, client);

            // Verificar se itens são válidos e cria eles
            for (const itemIndex in itens ) {
                const item = itens[itemIndex];

                const numberQuantidade = item.quantidade ? Number(item.quantidade) : 1;
                if (isNaN(numberQuantidade)) {
                    throw { statusCode: 400, message: `Quantidade do ${itemIndex+1}º item (id:${item.id_itemcardapio}) inválida.`}
                }

                const itemCardapio = await ItemCardapioService.buscarItemCardapio(item.id_itemcardapio);
                if (!itemCardapio) {
                    throw { statusCode: 400, message: `O ${itemIndex+1}º item (id:${item.id_itemcardapio}) é inválido ou foi excluído.`}
                }

                const resultItemPedido = await ItemPedidoModel.adicionarItemPedido(resultPedido.id_pedido, itemCardapio.id_itemcardapio, item.quantidade, itemCardapio.valor, item.observacao, client);

                // Verifica se os adicionais são válidos e cria eles
                for (const adicionalIndex in item.adicionais) {
                    const adicional = await AdicionaisService.buscarAdicional(item.adicionais[adicionalIndex].id_adicional);
                    
                    if (!adicional) {
                        throw { statusCode: 400, message: `O ${itemIndex+1}º item (id:${item.id_itemcardapio}) possui adicional inválido ou que foi excluído.`}
                    }

                    AdicionalItemPedidoModel.novoAdicionalItemPedido(resultItemPedido.id_itempedido, adicional.id_adicional, adicional.valor, client)

                }

            }

            // Finaliza a transaction;

            await client.query("COMMIT");

        } catch (err: any) {
            console.error("Erro no service: ", err);

            // Desfaz a transaction em caso de erro
            await client.query("ROLLBACK");

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async buscarPedidoMesa ({id_mesa}:pedidoDTO) {
        try {

            if (!id_mesa) {
                throw { statusCode: 400, message: "Mesa inválida" }
            }

            const number_id_mesa = Number(id_mesa);
            if (isNaN(number_id_mesa)) {
                throw { statusCode: 400, message: "Mesa inválida" }
            }

            const pedido = await PedidoModel.buscarPedidoMesa(number_id_mesa);

            const itensPedido = await ItemPedidoModel.listarItensDoPedido(pedido.id_pedido);

            for (const item of itensPedido) {
                const adicionaisItem = await AdicionalItemPedidoModel.listarAdicionaisDoItemPedido(item.id_itempedido);

                item.adicionais = adicionaisItem;
            }

            pedido.itens = itensPedido

            return pedido;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

}

export default PedidoService;