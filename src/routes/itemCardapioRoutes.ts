import express from "express";
import { deletarItemCardapio, listarCardapio, salvarItemCardapio } from "../controllers/itemCardapioController";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export default (router: express.Router) => {
    router.get('/listarCardapio', listarCardapio );
    router.post('/salvarItemCardapio', upload.single('file'), salvarItemCardapio);
    router.post('/deletarItemCardapio', deletarItemCardapio);
};
