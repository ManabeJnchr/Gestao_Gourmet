import express from "express";
import { listarMesas } from '../controllers/mesaController';

export default (router: express.Router) => {
    router.get('/listarMesas', listarMesas);
};
