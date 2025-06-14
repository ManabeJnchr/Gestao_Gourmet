import express from 'express';
import MesaService from '../services/MesaService';
import RelatorioService from '../services/RelatorioService';


export const gerarRelatorioCardapio = async (req: express.Request, res: express.Response) => {
    try {
        const result = await RelatorioService.gerarRelatorioCardapio(req.body)

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const gerarRelatorioFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const result = await RelatorioService.gerarRelatorioFuncionario(req.body)

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const gerarRelatorioPedido = async (req: express.Request, res: express.Response) => {
    try {
        const result = await RelatorioService.gerarRelatorioPedido(req.body)

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const gerarRelatorioPagamento = async (req: express.Request, res: express.Response) => {
    try {
        const result = await RelatorioService.gerarRelatorioPagamento(req.body)

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};