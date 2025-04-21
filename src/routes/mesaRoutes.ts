import express from "express";
import { listarMesas, salvarMesa } from '../controllers/mesaController';

export default (router: express.Router) => {
    router.get('/listarMesas', listarMesas);
    router.post('/salvarMesa', salvarMesa);
};
