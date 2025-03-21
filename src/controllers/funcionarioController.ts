import express from 'express';
import pool from '../database';
import { multerConfig } from '../config/multer';
import multer from 'multer';

const upload = multer(multerConfig);

export const adicionarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, nome, telefone } = req.body;
        const imagePath = req.file?.filename;

        // Inserir no banco de dados
        const result = await pool.query(`
            INSERT INTO funcionario (nome, cpf, idcargo, telefone, imagem) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [nome, cpf, cargo, telefone, imagePath]);

        // Retornar ao front-end
        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const atualizarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, id, nome, telefone } = req.body;
        const imagePath = req.file?.filename;

        // Atualizar no banco de dados
        const result = await pool.query(`
            UPDATE funcionario
            SET nome = $1, cpf = $2, idcargo = $3, telefone = $4, imagem = $5
            WHERE idfuncionario = $6
            RETURNING *
        `, [nome, cpf, cargo, telefone, imagePath, id]);

        // Retornar ao front-end
        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, id, nome, telefone } = req.body;
        console.log(req.body);

        if (!cargo || !cpf || !id || !nome || !telefone) {
            res.json({ "erro": "Algum argumento está faltando" });
            return;
        }

        if (id === -1) {
            adicionarFuncionario(req, res);
        } else {
            atualizarFuncionario(req, res);
        }

    } catch (err) {
        console.error(err);
        res.json({ "erro": err });
    }
};

export const listarFuncionarios = async (req: express.Request, res: express.Response) => {
    try {
        const result = await pool.query('SELECT f.idfuncionario, f.nome, f.cpf, f.idcargo, c.nome cargo, f.telefone, f.imagem FROM funcionario f LEFT JOIN cargo c on c.idcargo = f.idcargo order by f.nome, cargo asc');
        const funcionarios = result.rows.map((funcionario: any) => ({
            ...funcionario,
            imagem: funcionario.imagem ? `${req.protocol}://${req.get('host')}/uploads/${funcionario.imagem}` : null
        }));
        res.json(funcionarios);
    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({ "erro": err });
    }
};

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const { id } = req.body;

        const result = await pool.query(`
            DELETE FROM funcionario
            WHERE idfuncionario = $1
            RETURNING *;
        `, [id]);

        res.json(-1);

    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({ "erro": err });
    }
};

// Rota para upload de arquivos e salvar informações do funcionário
export const uploadFuncionario = [
    upload.single('file'),
    async (req: express.Request, res: express.Response) => {
        try {
            const { cargo, cpf, nome, telefone, id } = req.body;
            const imagePath = req.file?.filename;

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