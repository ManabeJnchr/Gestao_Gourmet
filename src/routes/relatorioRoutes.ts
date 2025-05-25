import express from "express";
import { gerarRelatorioCardapio } from "../controllers/relatorioController";

export default (router: express.Router) => {
    router.post('/gerarRelatorioCardapio', gerarRelatorioCardapio );

};
