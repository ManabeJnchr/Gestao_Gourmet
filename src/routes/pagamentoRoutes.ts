import express from "express";
import { adicionarPagamentos, listarPagamentos } from "../controllers/pagamentoController";

export default (router: express.Router) => {
    router.get('/listarPagamentos', listarPagamentos );
    router.post('/adicionarPagamentos', adicionarPagamentos );
};
