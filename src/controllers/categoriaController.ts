import express from 'express';
import CategoriaService from '../services/CategoriaService';


export const listarCategorias = async (req: express.Request, res: express.Response) => {
    try {
        const result = await CategoriaService.listarCategorias();
        
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