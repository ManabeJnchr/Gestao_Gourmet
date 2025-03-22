import express from "express";
import multer from "multer";

import { salvarFuncionario, listarFuncionarios, deletarFuncionario } from '../controllers/funcionarioController';

const upload = multer({
    limits: {
        fileSize: 25 * 1024 * 1024, // Aumentar o limite de tamanho do arquivo para 25MB
        fieldSize: 25 * 1024 * 1024, // Aumentar o limite de tamanho do campo para 25MB
    }
});

export default (router: express.Router) => {
    router.post('/salvarFuncionario', upload.single('imagem'), salvarFuncionario);
    router.get('/listarFuncionarios', listarFuncionarios);
    router.post('/deletarFuncionario', deletarFuncionario);
};
