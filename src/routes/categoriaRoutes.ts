import express from "express";
import { listarCategorias } from "../controllers/categoriaController";

export default (router: express.Router) => {
    router.get('/listarCategorias', listarCategorias);
};
