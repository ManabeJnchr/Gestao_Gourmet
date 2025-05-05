import express from "express";
import { listarPedidos, novoPedido, buscarPedidoMesa } from "../controllers/pedidoController";

export default (router: express.Router) => {
    router.get('/listarPedidos', listarPedidos );
    router.post('/novoPedido', novoPedido );
    router.post('/buscarPedidoMesa', buscarPedidoMesa );
};
