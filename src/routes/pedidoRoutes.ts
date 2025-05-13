import express from "express";
import { listarPedidos, novoPedido, buscarPedidoMesa, adicionarItemPedido, removerItemPedido, cancelarPedido } from "../controllers/pedidoController";

export default (router: express.Router) => {
    router.get('/listarPedidos', listarPedidos );
    router.post('/novoPedido', novoPedido );
    router.post('/buscarPedidoMesa', buscarPedidoMesa );
    router.post('/adicionarItemPedido', adicionarItemPedido );
    router.post('/removerItemPedido', removerItemPedido );
    router.post('/cancelarPedido', cancelarPedido );
};
