import RelatorioModel from "../models/RelatorioModel";

interface RelatorioParams {
    data_inicial?: string | Date;
    data_final?: string | Date;
};

interface RelatorioCardapioParams extends RelatorioParams {
    categoria?: string | number
    exibir_inativo: boolean
} 

interface RelatorioFuncionarioParams extends RelatorioParams {
    cargo?: string | number
} 

interface RelatorioPedidoParams extends RelatorioParams {
    mesa?: string | number
} 

class RelatorioService {

    static async gerarRelatorioCardapio ({categoria, data_inicial, data_final, exibir_inativo} : RelatorioCardapioParams) {
        try {

            let paramIndex = 1;
            const values = []

            const conditionsData = [];
            let filtroData = '';

            if (data_inicial) {
                conditionsData.push(`pedido.data_pedido >= $${paramIndex}`)
                values.push(data_inicial);
                paramIndex++
            }

            if (data_final) {
                conditionsData.push(`pedido.data_pedido <= $${paramIndex}`)
                values.push(data_final);
                paramIndex++
            }

            if (conditionsData.length > 0) {
                filtroData += 'AND ' + conditionsData.join(' AND ');
            }

            const conditions = [];
            let filtroWhere = '';

            if(categoria) {
                conditions.push(`ic.id_categoria = $${paramIndex}`)
                values.push(categoria)
                paramIndex++
            }

            if (!exibir_inativo) {
                conditions.push(`ic.ativo = true`)
            }

            if (conditions.length > 0) {
                filtroWhere += `WHERE ` + conditions.join(' AND ');
            }

            let query = `
                SELECT ic.id_itemcardapio,
                    ic.nome AS nome_item,
                    c.nome AS categoria,
                    ic.valor AS valor_atual,
                    ic.ativo,
                    COALESCE(SUM(ip.quantidade), 0) AS vezes_pedido,
                    COALESCE(SUM(ip.valor * ip.quantidade), 0) AS valor_sem_adicionais,
                    COALESCE(SUM(aip.valor_adicionais * ip.quantidade), 0) AS valor_adicionais,
                    COALESCE(SUM(ip.valor * ip.quantidade), 0) + COALESCE(SUM(aip.valor_adicionais * ip.quantidade), 0) AS valor_total_com_adicionais
                FROM itemcardapio ic JOIN categoria c ON ic.id_categoria = c.id_categoria
                                    LEFT JOIN itempedido ip ON ic.id_itemcardapio = ip.id_itemcardapio
                                    JOIN (
                                        SELECT * FROM pedido  
                                        WHERE pedido.id_statuspedido = 3 ${filtroData}
                                    ) p ON p.id_pedido = ip.id_pedido
                                    LEFT JOIN (
                                                SELECT id_itempedido, SUM(valor) AS valor_adicionais
                                                FROM adicional_itempedido
                                                GROUP BY id_itempedido
                                            ) aip ON aip.id_itempedido = ip.id_itempedido
                ${filtroWhere}
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

    static async gerarRelatorioFuncionario ({cargo, data_inicial, data_final} : RelatorioFuncionarioParams) {
        try {

            let paramIndex = 1;
            const values = []

            const conditionsData = [];
            let filtroData = '';

            if (data_inicial) {
                conditionsData.push(`p.data_pedido >= $${paramIndex}`)
                values.push(data_inicial);
                paramIndex++
            }

            if (data_final) {
                conditionsData.push(`p.data_pedido <= $${paramIndex}`)
                values.push(data_final);
                paramIndex++
            }

            if (conditionsData.length > 0) {
                filtroData += 'AND ' + conditionsData.join(' AND ');
            }

            const conditions = [];
            let filtroFuncionario = '';

            if(cargo) {
                conditions.push(`f.id_cargo = $${paramIndex}`)
                values.push(cargo)
                paramIndex++
            }

            if (conditions.length > 0) {
                filtroFuncionario += 'WHERE ' + conditions.join(' AND ');
            }

            let query = `
                SELECT 
                f.nome,
                f.cpf,
                COALESCE(pedidos.qtde_atendimentos, 0) AS qtde_atendimentos,
                COALESCE(valores.valor_total_vendido, 0) AS valor_total_vendido
                FROM funcionario f
                LEFT JOIN (
                    SELECT 
                        p.id_funcionario,
                        COUNT(DISTINCT p.id_pedido) AS qtde_atendimentos
                    FROM pedido p
                    WHERE p.id_statuspedido = 3 ${filtroData}
                    GROUP BY p.id_funcionario
                ) pedidos ON pedidos.id_funcionario = f.id_funcionario
                LEFT JOIN (
                    SELECT 
                        p.id_funcionario,
                        SUM(ip.valor * ip.quantidade + COALESCE(aip.valor_adicionais, 0)) AS valor_total_vendido
                    FROM pedido p
                    LEFT JOIN itempedido ip ON ip.id_pedido = p.id_pedido
                    LEFT JOIN (
                        SELECT id_itempedido, SUM(valor) AS valor_adicionais
                        FROM adicional_itempedido
                        GROUP BY id_itempedido
                    ) aip ON aip.id_itempedido = ip.id_itempedido
                    WHERE p.id_statuspedido = 3 ${filtroData}
                    GROUP BY p.id_funcionario
                ) valores ON valores.id_funcionario = f.id_funcionario
                ${filtroFuncionario}
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

    static async gerarRelatorioPedido ({mesa, data_inicial, data_final} : RelatorioPedidoParams) {
        try {

            let paramIndex = 1;
            const values = []
            const conditions = [];

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

            if(mesa) {
                conditions.push(`p.id_mesa = $${paramIndex}`)
                values.push(mesa)
                paramIndex++
            }

            let query = `
                SELECT 
                    COUNT(DISTINCT p.id_pedido) AS total_pedidos,
                    COALESCE(SUM(ip.quantidade), 0) AS total_itens_vendidos,
                    COALESCE(SUM(ip.valor * ip.quantidade) + SUM(COALESCE(aip.total_adicionais, 0)), 0) AS valor_total_pedidos,
                    ROUND(
                        COALESCE(
                            (SUM(ip.valor * ip.quantidade) + SUM(COALESCE(aip.total_adicionais, 0)))::numeric / NULLIF(COUNT(DISTINCT p.id_pedido), 0),
                            0
                        ),
                        2
                    ) AS media_valor_por_pedido
                FROM pedido p
                LEFT JOIN itempedido ip ON ip.id_pedido = p.id_pedido
                LEFT JOIN (
                    SELECT id_itempedido, SUM(valor) AS total_adicionais
                    FROM adicional_itempedido
                    GROUP BY id_itempedido
                ) aip ON aip.id_itempedido = ip.id_itempedido
                WHERE p.id_statuspedido = 3 ${conditions.length ? 'AND ' + conditions.join(' AND ') : ''}
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

    static async gerarRelatorioPagamento ({mesa, data_inicial, data_final} : RelatorioPedidoParams) {
        try {

            let paramIndex = 1;
            const values = []
            const conditions = [];

            if (data_inicial) {
                conditions.push(`pag.data_pagamento >= $${paramIndex}`)
                values.push(data_inicial);
                paramIndex++
            }

            if (data_final) {
                conditions.push(`pag.data_pagamento <= $${paramIndex}`)
                values.push(data_final);
                paramIndex++
            }

            if(mesa) {
                conditions.push(`ped.id_mesa = $${paramIndex}`)
                values.push(mesa)
                paramIndex++
            }

            let query = `
                SELECT 
                    mp.nome AS meio_pagamento,
                    SUM(valor_pagamento) AS valor_pagamentos
                FROM pagamento pag JOIN meiopagamento mp ON pag.id_meiopagamento = mp.id_meiopagamento
                            JOIN pedido ped ON pag.id_pedido = ped.id_pedido
                ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
                GROUP BY nome
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