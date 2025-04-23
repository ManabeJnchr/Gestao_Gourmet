import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { multerConfig } from "../config/multer";
import { deletarItemCardapio, listarCardapio, salvarItemCardapio } from "../controllers/itemCardapioController";

const upload = multer(multerConfig);

const asyncHandler = (fn: express.RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).then(() => undefined).catch(next);
};

export default (router: express.Router) => {
    router.get('/listarCardapio', asyncHandler(listarCardapio));

    router.post('/salvarItemCardapio', upload.single('file'), asyncHandler(salvarItemCardapio));

    router.post('/deletarItemCardapio', asyncHandler(deletarItemCardapio));
};
