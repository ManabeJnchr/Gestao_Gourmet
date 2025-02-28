
import express from "express";

import { salvarFuncionario } from '../controllers/funcionarioController';

export default (router: express.Router) => {
    router.post('/addfuncionario', salvarFuncionario);
};
