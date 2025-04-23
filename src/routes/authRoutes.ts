import express from "express";
import { acceptPasswordReset, getIdentity, login, logout, requestPasswordReset } from "../controllers/authenticationController";

export default (router: express.Router) => {
    router.post('/login', login);
    router.get('/identity', getIdentity);
    router.get('/logout', logout);
    router.post('/requestPasswordReset', requestPasswordReset);
    router.post('/acceptPasswordReset', acceptPasswordReset);
};
