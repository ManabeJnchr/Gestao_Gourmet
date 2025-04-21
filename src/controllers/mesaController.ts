import express from 'express';
import fs from 'fs';
import path from 'path';
import MesaService from '../services/MesaService';


export const salvarMesa = async (req: express.Request, res: express.Response) => {
    try {
        const result = await MesaService.salvarMesa(req.body)

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const listarMesas = async (req: express.Request, res: express.Response) => {
    try {
        const result = await MesaService.listarMesas();
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const deletarMesa = async (req: express.Request, res: express.Response) => {
    try {
        const { id_mesa } = req.body;

        res.json(-1);

    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};