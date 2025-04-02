import express from "express";
import { getIdentity, login, logout } from "../controllers/authenticationController";

export default (router: express.Router) => {
    router.post('/login', login);
    router.get('/identity', getIdentity);
    router.get('/logout', logout);
};
