import express from 'express';
import { multerConfig } from '../config/multer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FuncionarioService from '../services/FuncionarioService';

const upload = multer(multerConfig);

export const adicionarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { id_cargo, cpf, nome, telefone } = req.body;
        const imagePath: string | undefined = req.file ? req.file.filename : undefined;

        const result = await FuncionarioService.salvarFuncionario({ id_funcionario: -1, id_cargo, cpf, nome, telefone, imagePath });
        return res.json(result);

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const atualizarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { id_cargo, cpf, id_funcionario, nome, telefone } = req.body;
        let imagePath: string | null = req.file ? req.file.filename : (req.body.imagem || null);

        if (req.file) {
            const oldImagePath = await FuncionarioService.getFuncionarioImagePath(id_funcionario);
            if (oldImagePath) {
                fs.unlink(path.join('uploads', oldImagePath), (err) => {
                    if (err) {
                        console.error('Erro ao apagar a imagem antiga:', err);
                    }
                });
            }
        }

        const result = await FuncionarioService.salvarFuncionario({ id_funcionario, cpf, id_cargo, nome, telefone, imagePath });
        return res.json({
            ...result,
            imagem: result.imagem ? `/uploads/${result.imagem}` : null // Ensure the image path is correct
        });

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { id_cargo, cpf, id_funcionario, nome, telefone } = req.body;

        if (!id_cargo || !cpf || !id_funcionario || !nome || !telefone) {
            res.json({ "erro": "Algum argumento está faltando" });
            return;
        }

        if (id_funcionario === -1) {
            await adicionarFuncionario(req, res);
        } else {
            await atualizarFuncionario(req, res);
        }

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const listarFuncionarios = async (req: express.Request, res: express.Response) => {
    try {
        const funcionarios = await FuncionarioService.listarFuncionarios();
        res.json(funcionarios);
    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { id_funcionario } = req.body;

        const imagePath = await FuncionarioService.getFuncionarioImagePath(id_funcionario);
        await FuncionarioService.deletarFuncionario(id_funcionario);

        if (imagePath) {
            fs.unlink(path.join('uploads', imagePath), (err) => {
                if (err) {
                    console.error('Erro ao apagar a imagem:', err);
                }
            });
        }

        res.json(-1);

    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};

// Rota para upload de arquivos e salvar informações do funcionário
export const uploadFuncionario = [
    upload.single('file'),
    async (req: express.Request, res: express.Response) => {
        try {
            const { id_cargo, cpf, nome, telefone, id_funcionario } = req.body;
            const imagePath: string | undefined = req.file ? req.file.filename : req.body.imagem;

            if (!id_cargo || !cpf || !nome || !telefone) {
                res.status(400).json({ message: 'Algum argumento está faltando' });
                return;
            }

            if (id_funcionario === '-1') {
                await adicionarFuncionario(req, res);
            } else {
                await atualizarFuncionario(req, res);
            }

        } catch (error) {
            console.error('Erro ao salvar no banco:', error);
            res.status(500).json({ message: 'Erro ao salvar no banco de dados', error });
        }
    }
];