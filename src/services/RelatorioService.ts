import PedidoModel from "../models/PedidoModel";
import MesaService from "./MesaService";
import pool from "../database";
import MesaModel from "../models/MesaModel";
import PagamentoModel from "../models/PagamentoModel";
import PedidoService from "./PedidoService";
import RelatorioModel from "../models/RelatorioModel";

interface RelatorioParams {
    data_inicial?: string | Date;
    data_final?: string | Date;
};

interface RelatorioCardapioParams extends RelatorioParams {
    categoria?: string | number
    exibir_inativo: boolean
} 

class RelatorioService {

    static async gerarRelatorioCardapio ({categoria, data_inicial, data_final, exibir_inativo} : RelatorioCardapioParams) {
        try {
            let query = `
                SELECT ic.id_itemcardapio,
                    ic.nome AS nome_item,
                    c.nome AS categoria,
                    ic.valor AS valor_atual,
                    ic.ativo,
                    COALESCE(SUM(ip.quantidade), 0) AS vezes_pedido,
                    COALESCE(SUM(ip.valor), 0) AS valor_sem_adicionais,
                    COALESCE(SUM(aip.valor_adicionais), 0) AS valor_adicionais,
                    COALESCE(SUM(ip.valor), 0) + COALESCE(SUM(aip.valor_adicionais), 0) AS valor_total_com_adicionais
                FROM itemcardapio ic JOIN categoria c ON ic.id_categoria = c.id_categoria
                                    LEFT JOIN itempedido ip ON ic.id_itemcardapio = ip.id_itemcardapio
                                    LEFT JOIN pedido p ON p.id_pedido = ip.id_pedido
                                    LEFT JOIN (
                                                SELECT id_itempedido, SUM(valor) AS valor_adicionais
                                                FROM adicional_itempedido
                                                GROUP BY id_itempedido
                                            ) aip ON aip.id_itempedido = ip.id_itempedido

            `

            const conditions = [];
            const values = [];
            let paramIndex = 1;

            if (data_inicial) {
                conditions.push(`p.data_pedido >= $${paramIndex}`)
                values.push(data_inicial);
                paramIndex++
            }

            if (data_final) {
                conditions.push(`p.data_pedido <= $${paramIndex}`)
                values.push(data_final);
                paramIndex++
            }

            if(categoria) {
                conditions.push(`ic.id_categoria = $${paramIndex}`)
                values.push(categoria)
                paramIndex++
            }

            if (!exibir_inativo) {
                conditions.push(`ic.ativo = true`)
            }

            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(' AND ');
            }

            query += `
                GROUP BY ic.id_itemcardapio, ic.nome, c.nome, ic.valor, ic.ativo
                ORDER BY vezes_pedido DESC; 
            `

            const result = await RelatorioModel.gerarRelatorio(query, values)

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }

    }


}

export default RelatorioService;