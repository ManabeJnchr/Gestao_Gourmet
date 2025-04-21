import express from "express";
import { deletarMesa, listarMesas, salvarMesa } from '../controllers/mesaController';

export default (router: express.Router) => {
    router.get('/listarMesas', listarMesas);
    router.post('/salvarMesa', salvarMesa);
    router.post('/deletarMesa', deletarMesa);
};
