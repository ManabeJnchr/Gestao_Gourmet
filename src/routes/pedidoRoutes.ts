import express from "express";
import { listarPedidos, novoPedido, buscarPedidoMesa, adicionarItensPedido, removerItemPedido, cancelarPedido, fecharPedido } from "../controllers/pedidoController";

export default (router: express.Router) => {
    router.get('/listarPedidos', listarPedidos );
    router.post('/novoPedido', novoPedido );
    router.post('/buscarPedidoMesa', buscarPedidoMesa );
    router.post('/adicionarItensPedido', adicionarItensPedido );
    router.post('/removerItemPedido', removerItemPedido );
    router.post('/cancelarPedido', cancelarPedido );
    router.post('/fecharPedido', fecharPedido );
};
