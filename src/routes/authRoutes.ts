import express from "express";
import { aceitarResetSenha, getIdentity, login, logout, solicitarResetSenha, trocarSenha, listarSolicitacoesResetSenha } from "../controllers/authenticationController";

export default (router: express.Router) => {
    router.post('/login', login);
    router.get('/identity', getIdentity);
    router.get('/logout', logout);
    router.post('/solicitarResetSenha', solicitarResetSenha);
    router.post('/aceitarResetSenha', aceitarResetSenha);
    router.post('/trocarSenha', trocarSenha);
    router.get('/listarSolicitacoesResetSenha', listarSolicitacoesResetSenha);
};
