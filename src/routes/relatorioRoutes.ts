import express from "express";
import { gerarRelatorioCardapio, gerarRelatorioFuncionario } from "../controllers/relatorioController";

export default (router: express.Router) => {
    router.post('/gerarRelatorioCardapio', gerarRelatorioCardapio );
    router.post('/gerarRelatorioFuncionario', gerarRelatorioFuncionario );

};
