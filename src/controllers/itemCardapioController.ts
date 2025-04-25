import express from 'express';
import ItemCardapioService from '../services/ItemCardapioService';


export const salvarItemCardapio = async (req: express.Request, res: express.Response) => {
    try {
        const imagem = req.file ? req.file.buffer : null;
        
        const registro = JSON.parse(req.body.registro);

        const result = await ItemCardapioService.salvarItemCardapio(registro, imagem)

        
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

export const listarCardapio = async (req: express.Request, res: express.Response) => {
    try {
        const result = await ItemCardapioService.listarCardapio();

        res.status(200).json(result);
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const deletarItemCardapio = async (req: express.Request, res: express.Response) => {
    try {

        await ItemCardapioService.deletarItemCardapio(req.body)

        res.status(200).json(-1);

    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};