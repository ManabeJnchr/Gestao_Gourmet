import express from "express";
import { gerarRelatorioCardapio, gerarRelatorioFuncionario, gerarRelatorioPedido } from "../controllers/relatorioController";

export default (router: express.Router) => {
    router.post('/gerarRelatorioCardapio', gerarRelatorioCardapio );
    router.post('/gerarRelatorioFuncionario', gerarRelatorioFuncionario );
    router.post('/gerarRelatorioPedido', gerarRelatorioPedido );

};
