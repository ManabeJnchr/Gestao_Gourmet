import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import pool from '../database';
import FuncionarioService from '../services/FuncionarioService';

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const data = req.body;
        if (req.file) {
            const file = req.file;
            const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'funcionarios');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            const hash = crypto.createHash('md5').update(file.originalname + Date.now().toString()).digest('hex');
            const fileExtension = path.extname(file.originalname);
            const filePath = path.join(uploadPath, `${hash}${fileExtension}`);
            fs.writeFileSync(filePath, file.buffer);
            data.imagem = `/uploads/funcionarios/${hash}${fileExtension}`;
        }
        const result = await FuncionarioService.salvarFuncionario(data);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(err.statusCode || 500).json({ "erro": err.message || "Erro interno no servidor. Por favor, tente novamente" });
    }
}

export const listarFuncionarios = async (req: express.Request, res: express.Response) => {
    try {
        const result : any = await FuncionarioService.listarFuncionarios();

        // res.status(200).json({mensagem:result.mensagem || "Operação realizada com sucesso", result});
        res.status(200).json(result);
    } catch (err: any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro ao listar funcionários. Por favor, tente novamente"})
    }
}

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const result : any = await FuncionarioService.deletarFuncionario(req.body)


        // res.status(200).json({mensagem:result.mensagem || "Operação realizada com sucesso", result:result.rows || []});
        res.status(200).json(result.rows);

    } catch (err: any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro ao deletar funcionário. Por favor, tente novamente"})
    }
}