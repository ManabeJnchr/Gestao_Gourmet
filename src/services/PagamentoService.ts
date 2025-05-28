import PedidoModel from "../models/PedidoModel";
import MesaService from "./MesaService";
import pool from "../database";
import MesaModel from "../models/MesaModel";
import PagamentoModel from "../models/PagamentoModel";
import PedidoService from "./PedidoService";

interface pagamentoDTO {
    id_pagamento?: any,
    id_pedido: any,
    id_meiopagamento: any,
    valor_pagamento: any,
}

interface listaPagamentosDTO {
    id_pedido?: any,
    pagamentos: Array<pagamentoDTO>
}

class PagamentoService {

    static async listarPagamentos ({id_pedido} : pagamentoDTO) {
        try {

            if (!id_pedido) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            const number_id_pedido = Number(id_pedido);
            
            if (isNaN(number_id_pedido)) {
                throw { statusCode: 400, message: "ID do pedido é inválido" }
            }

            const result = await PagamentoModel.listarPagamentosPedido(number_id_pedido)

            return result;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async listarMeiosPagamento () {
        try {

            const result = await PagamentoModel.listarMeiosPagamento();

            return result;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }

    static async adicionarPagamentos ({id_pedido, pagamentos} : listaPagamentosDTO) {
        const client = await pool.connect();

        try {

            if (!pagamentos || !pagamentos.length) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }

            // Verificar se pedido específico é valido para adicionar pagamentos
            const pedido = await PedidoService.buscarPedido({id_pedido});
            if (!pedido) {
                throw { statusCode: 400, message: "Pedido inválido" }
            }

            if (pedido.id_statuspedido !== 2) {
                throw { statusCode: 400, message: "Status do pedido impossibilita adição de pagamento" }
            }

            // Inicia a transaction
            const valorPedido = await PedidoService.somarValorTotal({id_pedido:pedido.id_pedido})

            await client.query("BEGIN");

            let somaPagamentos = 0

            for (const pagamentoIndex in pagamentos) {
                const pagamento = pagamentos[pagamentoIndex];
                const valor = Number(pagamento.valor_pagamento)

                if (isNaN(valor) || valor <= 0) {
                    throw { statusCode: 400, message: `${pagamentoIndex+1}º pagamento possui valor inválido` }
                }

                await PagamentoModel.adicionarPagamento(id_pedido, pagamento.id_meiopagamento, valor, client)
                somaPagamentos += valor;
            }

         
            if (somaPagamentos !== valorPedido) {
                throw { statusCode: 400, message: "Soma dos pagamentos é diferente do valor total do pedido" }
            }

            // Muda o status da mesa para "disponível"

            const mesa = await MesaService.buscarMesa({id_mesa:pedido.id_mesa});
            if (!mesa) {
                throw { statusCode: 400, message: "Mesa do pedido é inválida" }
            }

            await MesaModel.atualizarMesa(mesa.id_mesa, mesa.numero_mesa, mesa.qtd_lugares, 2);

            // Muda o status do pedido para "concluído"
            await PedidoModel.atualizarPedido(pedido.id_pedido, pedido.id_mesa, pedido.observacao, pedido.id_funcionario, 3)

            // Finaliza a transaction;
            
            await client.query("COMMIT");
            
            return true; // Retorna true em caso de sucesso

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

export default PagamentoService;