import express from 'express';
import fs from 'fs';
import path from 'path';
import MesaService from '../services/MesaService';


export const salvarMesa = async (req: express.Request, res: express.Response) => {
    try {
        const result = await MesaService.salvarMesa(req.body)

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const listarMesas = async (req: express.Request, res: express.Response) => {
    try {
        const funcionarios = await MesaService.listarMesas();
        res.json(funcionarios);
    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
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