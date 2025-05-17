import express from 'express';
import PagamentoService from '../services/PagamentoService';


export const listarPagamentos = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PagamentoService.listarPagamentos(req.body);
        
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

export const adicionarPagamentos = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PagamentoService.adicionarPagamentos(req.body);
        
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