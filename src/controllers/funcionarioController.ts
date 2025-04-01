import express from 'express';
import { multerConfig } from '../config/multer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FuncionarioService from '../services/FuncionarioService';

const upload = multer(multerConfig);

export const adicionarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, nome, telefone } = req.body;
        const imagePath: string | undefined = req.file ? req.file.filename : undefined;

        const result = await FuncionarioService.salvarFuncionario({ id: -1, cargo, cpf, nome, telefone, imagePath });
        return res.json(result);

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const atualizarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, id, nome, telefone } = req.body;
        let imagePath: string | null = req.file ? req.file.filename : (req.body.imagem || null);

        if (req.file) {
            const oldImagePath = await FuncionarioService.getFuncionarioImagePath(id);
            if (oldImagePath) {
                fs.unlink(path.join('uploads', oldImagePath), (err) => {
                    if (err) {
                        console.error('Erro ao apagar a imagem antiga:', err);
                    }
                });
            }
        }

        const result = await FuncionarioService.salvarFuncionario({ id, cpf, cargo, nome, telefone, imagePath });
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
};

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
};

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const { id } = req.body;

        const imagePath = await FuncionarioService.getFuncionarioImagePath(id);
        await FuncionarioService.deletarFuncionario({ id, cargo: '', cpf: '', nome: '', telefone: '' });

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
            const { cargo, cpf, nome, telefone, id } = req.body;
            const imagePath: string | undefined = req.file ? req.file.filename : req.body.imagem;

            if (!cargo || !cpf || !nome || !telefone) {
                res.status(400).json({ message: 'Algum argumento está faltando' });
                return;
            }

            if (id === '-1') {
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