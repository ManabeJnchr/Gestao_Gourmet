import express from "express";
import { listarPedidos, novoPedido } from "../controllers/pedidoController";

export default (router: express.Router) => {
    router.get('/listarPedidos', listarPedidos );
    router.post('/novoPedido', novoPedido );
};
