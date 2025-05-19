import express from "express";
import { adicionarPagamentos, listarPagamentos, listarMeiosPagamento } from "../controllers/pagamentoController";

export default (router: express.Router) => {
    router.get('/listarPagamentos', listarPagamentos );
    router.get('/listarMeiosPagamento', listarMeiosPagamento );
    router.post('/adicionarPagamentos', adicionarPagamentos );

};
