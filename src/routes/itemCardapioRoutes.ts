import express from "express";
import { deletarItemCardapio, listarCardapio, salvarItemCardapio } from "../controllers/itemCardapioController";

export default (router: express.Router) => {
    router.get('/listarCardapio', listarCardapio );
    router.post('/salvarItemCardapio', salvarItemCardapio);
    router.post('/deletarItemCardapio', deletarItemCardapio);
};
