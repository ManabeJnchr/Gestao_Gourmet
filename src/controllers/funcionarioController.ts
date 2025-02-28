import express from 'express';
import pool from '../database'

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {

    try {
        const { cargo, cpf, id, nome, telefone} = req.body
        if (!(id === -1)) {
            return;
        }

        // Inserir no banco de dados

        const result = await pool.query(`
            INSERT INTO funcionario (nome, cpf, cargo_id, telefone) 

            VALUES ($1, $2, $3, $4) RETURNING *
        `, [nome, cpf, cargo, telefone])

        // Retornar ao front-end
        res.json(result.rows[0]);

        

    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({"erro":err});
    }
}

export const listarFuncionarios = async (req: express.Request, res: express.Response) => {
    try {
        const result = await pool.query('SELECT * FROM funcionario');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({"erro":err});
    }
}