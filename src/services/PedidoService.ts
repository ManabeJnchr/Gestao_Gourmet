import { Pool, PoolClient } from "pg";
import PedidoModel from "../models/PedidoModel";
import MesaService from "./MesaService";
import ItemCardapioService from "./ItemCardapioService";
import AdicionaisService from "./AdicionaisService";
import ItemPedidoModel from "../models/ItemPedidoModel";
import pool from "../database";
import FuncionarioService from "./FuncionarioService";
import AdicionalItemPedidoModel from "../models/AdicionalItemPedidoModel";
import MesaModel from "../models/MesaModel";

interface pedidoDTO {
    id_pedido?: any,
    id_mesa?: any,
    observacao?: string,
    id_funcionario?: any,
    id_statuspedido?: any,
    itens?: Array<itemDTO>
}

interface itemDTO {
    id_itempedido?: any,
    id_itemcardapio?: any,
    quantidade?: any,
    observacao?: string,
    adicionais?: Array<adicionalDTO>
}

interface adicionalDTO {
    id_adicional?: any
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

    static async novoPedido ({id_mesa, observacao="", id_funcionario, id_statuspedido=1, itens = []}: pedidoDTO) {
        const client = await pool.connect();

        try {
            if (!id_mesa || !id_funcionario || itens.length === 0) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se mesa específica é válida para criar um novo pedido
            const mesa = await MesaService.buscarMesa({id_mesa});
            if (!mesa) {
                throw { statusCode: 400, message: "Mesa inválida" }
            }

            if (mesa.id_status !== 2) {
                throw { statusCode: 400, message: "Status da mesa impossibilita criação de pedido" }
            }

            // Verificar se já existe um pedido não-concluído para a mesa especificada
            const verifPedido = await PedidoModel.buscarPedidoMesa(mesa.id_mesa);
            if (verifPedido) {
                throw { statusCode: 400, message: "Já há um pedido aberto nesta mesa" }
            }

            // Verificar se funcionário especificado é válido
            const funcionario = await FuncionarioService.buscarFuncionario(id_funcionario);
            if (!funcionario) {
                throw { statusCode: 400, message: "Funcionário inválido" }
            }

            // Inicia a transaction
            await client.query("BEGIN");

            // Muda o status da mesa para "aberta"
            await MesaModel.atualizarMesa(mesa.id_mesa, mesa.numero_mesa, mesa.qtd_lugares, 4);

            // Cria o pedido
            const resultPedido = await PedidoModel.adicionarPedido(mesa.id_mesa, observacao, funcionario.id_funcionario, id_statuspedido, client);

            // Verificar se itens são válidos e cria eles
            for (const itemIndex in itens ) {
                const item = itens[itemIndex];

                const numberQuantidade = item.quantidade ? Number(item.quantidade) : 1;
                if (isNaN(numberQuantidade)) {
                    throw { statusCode: 400, message: `Quantidade do ${itemIndex+1}º item (id:${item.id_itemcardapio}) inválida.`}
                }

                const itemCardapio = await ItemCardapioService.buscarItemCardapio({id_itemcardapio:item.id_itemcardapio});
                if (!itemCardapio) {
                    throw { statusCode: 400, message: `O ${itemIndex+1}º item (id:${item.id_itemcardapio}) é inválido ou foi excluído.`}
                }

                const resultItemPedido = await ItemPedidoModel.adicionarItemPedido(resultPedido.id_pedido, itemCardapio.id_itemcardapio, item.quantidade, itemCardapio.valor, item.observacao || "", client);

                if (item.adicionais) {
                    // Verifica se os adicionais são válidos e cria eles
                    for (const adicionalIndex in item.adicionais) {
                        if (item.adicionais[adicionalIndex].id_adicional) { // Se o adicional é válido (não é uma string vazia ou null)...
                            const adicional = await AdicionaisService.buscarAdicional({id_adicional:item.adicionais[adicionalIndex].id_adicional});
                            
                            if (!adicional) {
                                throw { statusCode: 400, message: `O ${itemIndex+1}º item (id:${item.id_itemcardapio}) possui adicional inválido ou que foi excluído.`}
                            }
        
                            AdicionalItemPedidoModel.novoAdicionalItemPedido(resultItemPedido.id_itempedido, adicional.id_adicional, adicional.valor, client)
                        }
                    }
                }


            }

            // Finaliza a transaction;

            await client.query("COMMIT");

            return resultPedido;

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

            if (!pedido) { // Se não há nenhum pedido ainda, retorna nulo
                return null;
            }

            const itensPedido = await ItemPedidoModel.listarItensDoPedido(pedido.id_pedido);

            for (const item of itensPedido) {
                if (item.imagem) {
                    const base64 = item.imagem.toString('base64');
                    item.imagemBase64 = `data:image/png;base64,${base64}`;
                }

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

    static async adicionarItensPedido ({id_pedido, itens}: pedidoDTO) {
        const client = await pool.connect();

        try {
            if (!id_pedido || !itens) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            if (!itens.length) {
                throw { statusCode: 400, message: "Nenhum item foi adicionado" }
            }

            // Verificar se id do pedido é válido
            const number_id_pedido = Number(id_pedido)
            if (isNaN(number_id_pedido)) {
                throw { statusCode: 400, message: "ID do pedido é inválido" }
            }

            const pedido = await PedidoModel.buscarPedido(number_id_pedido);
            if (!pedido) {
                throw { statusCode: 400, message: "ID do pedido é inválido" }
            }

            // Verificar se status do pedido permite a adição de itens
            if (pedido.id_statuspedido !== 1) { // Pedido não está "aberto"
                throw { statusCode: 400, message: "Este pedido não está ABERTO" }
            }

            // Inicia a transaction
            await client.query("BEGIN");

            for (const itemIndex in itens) {
                const item = itens[itemIndex];

                const numberQuantidade = item.quantidade ? Number(item.quantidade) : 1;
                if (isNaN(numberQuantidade)) {
                    throw { statusCode: 400, message: `Quantidade do ${itemIndex+1}º item é inválida.`}
                }
    
                const itemCardapio = await ItemCardapioService.buscarItemCardapio({id_itemcardapio:item.id_itemcardapio});
                if (!itemCardapio) {
                    throw { statusCode: 400, message: `O ${itemIndex+1}º item é inválido ou foi excluído.`}
                }
    
                const resultItemPedido = await ItemPedidoModel.adicionarItemPedido(id_pedido, itemCardapio.id_itemcardapio, numberQuantidade, itemCardapio.valor, item.observacao || "", client);
    
                // Verifica se os adicionais são válidos e cria eles
                if (item.adicionais) {
                    for (const adicionalIndex in item.adicionais) {
                        const adicional = await AdicionaisService.buscarAdicional({id_adicional:item.adicionais[adicionalIndex].id_adicional});
                        
                        if (!adicional) {
                            throw { statusCode: 400, message: `O ${itemIndex+1}º item possui adicional inválido ou que foi excluído.`}
                        }
        
                        AdicionalItemPedidoModel.novoAdicionalItemPedido(resultItemPedido.id_itempedido, adicional.id_adicional, adicional.valor, client)

                    }
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

    static async removerItemPedido ({id_itempedido}: itemDTO) {
        const client = await pool.connect();

        try {
            if (!id_itempedido) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se já existe um pedido não-concluído para a mesa especificada
            const number_id_itempedido = Number(id_itempedido);
            if (isNaN(number_id_itempedido)) {
                throw { statusCode: 400, message: "ID do item do pedido é inválido" }
            }

            const itemPedido = await ItemPedidoModel.buscarItemPedido(number_id_itempedido);
            if (!itemPedido) {
                throw { statusCode: 400, message: "ID do item do pedido é inválido" }
            }

            // Verificar se pedido em que se encontra o item é válido e permite edição
            const pedido = await PedidoModel.buscarPedido(itemPedido.id_pedido);
            if (pedido.id_statuspedido !== 1) { // Pedido não está "aberto"
                throw { statusCode: 400, message: "Este pedido não está ABERTO" }
            }

            // Inicia a transaction
            await client.query("BEGIN");

            
            // Remove os adicionais, caso tenha
            const adicionais = await AdicionalItemPedidoModel.listarAdicionaisDoItemPedido(itemPedido.id_itempedido)
            for (const adicionalIndex in adicionais) {
                const adicional = adicionais[adicionalIndex];
                await AdicionalItemPedidoModel.removerAdicionalItemPedido(adicional.id_adicional_itempedido, client)

            }

            const result = await ItemPedidoModel.removerItemPedido(id_itempedido, client);

            // Finaliza a transaction;
            await client.query("COMMIT");

            return result;
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

    static async cancelarPedido ({id_pedido}: pedidoDTO) {
        const client = await pool.connect();

        try {
            if (!id_pedido) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se pedido existe
            const number_id_pedido = Number(id_pedido);
            if (isNaN(id_pedido)) {
                throw { statusCode: 400, message: "ID do pedido é inválido" }
            }

            // Verificar se pedido existe e é válido para ser cancelado
            const pedido = await PedidoModel.buscarPedido(number_id_pedido);
            if (!pedido) {
                throw { statusCode: 400, message: "Pedido inexistente ou já cancelado." }
            }

            if (pedido.id_statuspedido !== 1) { // Pedido não está "aberto"
                throw { statusCode: 400, message: "O status desse pedido não permite que ele seja cancelado." }
            }

            const mesa = await MesaService.buscarMesa({id_mesa:pedido.id_mesa});

            // Inicia a transaction
            await client.query("BEGIN");

            // Mudar status da mesa para "disponível"
            await MesaModel.atualizarMesa(mesa.id_mesa, mesa.numero_mesa, mesa.qtd_lugares, 2);

            // Mudar status do pedido para "cancelado"
            const result = await PedidoModel.cancelarPedido(number_id_pedido);

            // Finaliza a transaction;
            await client.query("COMMIT");

            return result;
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

    static async fecharPedido ({id_pedido}: pedidoDTO) {
        const client = await pool.connect();

        try {
            if (!id_pedido) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se pedido existe
            const number_id_pedido = Number(id_pedido);
            if (isNaN(id_pedido)) {
                throw { statusCode: 400, message: "ID do pedido é inválido" }
            }

            // Verificar se pedido existe e é válido para ser cancelado
            const pedido = await PedidoModel.buscarPedido(number_id_pedido);
            if (!pedido) {
                throw { statusCode: 400, message: "Pedido inexistente ou cancelado." }
            }

            if (pedido.id_statuspedido !== 1) { // Pedido não está "aberto"
                throw { statusCode: 400, message: "O status desse pedido não permite que ele seja fechado." }
            }

            const mesa = await MesaService.buscarMesa({id_mesa:pedido.id_mesa});

            // Inicia a transaction
            await client.query("BEGIN");

            // Mudar status da mesa para "fechada"
            await MesaModel.atualizarMesa(mesa.id_mesa, mesa.numero_mesa, mesa.qtd_lugares, 4);

            // Mudar status do pedido para "fechado"
            const result = await PedidoModel.fecharPedido(number_id_pedido);

            // Finaliza a transaction;
            await client.query("COMMIT");

            return result;
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
}

export default PedidoService;