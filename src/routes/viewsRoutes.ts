
import express from "express";
import path from 'path';

export default (router: express.Router) => {
    router.get('/funcionarios', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "..", "..", "public", "html", "gerenciarFuncionarios.html"))
    })
};
