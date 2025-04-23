import express from "express";
import { aceitarResetSenha, getIdentity, login, logout, solicitarResetSenha } from "../controllers/authenticationController";

export default (router: express.Router) => {
    router.post('/login', login);
    router.get('/identity', getIdentity);
    router.get('/logout', logout);
    router.post('/requestPasswordReset', solicitarResetSenha);
    router.post('/acceptPasswordReset', aceitarResetSenha);
};
