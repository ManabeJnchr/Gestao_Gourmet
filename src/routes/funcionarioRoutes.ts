import express from "express";
import { uploadFuncionario, listarFuncionarios, deletarFuncionario } from '../controllers/funcionarioController';

export default (router: express.Router) => {
    router.post('/salvarFuncionario', uploadFuncionario);
    router.get('/listarFuncionarios', listarFuncionarios);
    router.post('/deletarFuncionario', deletarFuncionario);
};
