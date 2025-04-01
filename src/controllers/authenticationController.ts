import express from 'express';
import pool from '../database';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {

    } catch (err) {
        
    }
}
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { usuario, senha, idFuncionario } = req.body;

        if (!usuario || !senha || !idFuncionario) { // Faltam dados
            return res.sendStatus(400)
        }

        const usuarioExiste = await pool.query(`
            SELECT id FROM login
            WHERE usuario = $1 OR funcionario_id = $2
            `, [usuario, idFuncionario]);

        if (usuarioExiste.rowCount) { // Usuário já cadastrado
            return res.sendStatus(400);
        }

        const salt = random()

        const novoUsuario = await pool.query(`
            INSERT INTO login (usuario, senha_de_acesso, funcionario_id) 

            VALUES ($1, $2, $3)
            RETURNING *
            `, [usuario, authentication(salt, senha), idFuncionario])

        return res.sendStatus(200).json(novoUsuario).end();

    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}