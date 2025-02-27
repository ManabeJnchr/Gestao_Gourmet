import express from 'express';
import pool from '../database'

export const adicionarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo_id=1, cpf, id_func, nome, telefone} = req.body
        if (!(id_func === -1)) {
            return;
        }

        // Inserir no banco de dados

        const result = await pool.query(`
            INSERT INTO funcionario (nome, cpf, cargo_id, telefone) 

            VALUES ($1, $2, $3, $4) RETURNING *
        `, [nome, cpf, cargo_id, telefone])

        // Retornar ao front-end
        res.json(result.rows[0]);

        

    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({"message":err});
    }
}