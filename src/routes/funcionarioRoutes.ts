
import express from "express";

import { adicionarFuncionario } from '../controllers/funcionarioController';

export default (router: express.Router) => {
    router.post('/addfuncionario', adicionarFuncionario);
};
