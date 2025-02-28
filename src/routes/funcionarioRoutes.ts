
import express from "express";

import { salvarFuncionario, listarFuncionarios } from '../controllers/funcionarioController';

export default (router: express.Router) => {
    router.post('/salvarFuncionario', salvarFuncionario);
    router.get('/listarFuncionarios', listarFuncionarios);
};
