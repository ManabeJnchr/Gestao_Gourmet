import express from "express";
import multer from "multer";
import { salvarFuncionario, listarFuncionarios, deletarFuncionario } from '../controllers/funcionarioController';

export default (router: express.Router) => {
    router.post('/salvarFuncionario', upload.single('imagem'), salvarFuncionario);
    router.post('/salvarFuncionario', uploadFuncionario);
    router.get('/listarFuncionarios', listarFuncionarios);
    router.post('/deletarFuncionario', deletarFuncionario);
};
