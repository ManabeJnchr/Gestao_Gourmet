import express from 'express';
import pool from '../database'


export const adicionarFuncionario = async (req:express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, nome, telefone} = req.body;
    
        // Inserir no banco de dados
    
        const result = await pool.query(`
            INSERT INTO funcionario (nome, cpf, cargo_id, telefone) 
    
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [nome, cpf, cargo, telefone]);
    
        // Retornar ao front-end
        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.json({"erro":err});

    }

}

export const atualizarFuncionario = async (req:express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, id, nome, telefone} = req.body;
    
        // Atualizar no banco de dados
        const result = await pool.query(`
            UPDATE funcionario
            SET nome = $1, cpf = $2, cargo_id = $3, telefone = $4
            WHERE id = $5
            RETURNING *
        `, [nome, cpf, cargo, telefone, id]);
    
        // Retornar ao front-end
        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.json({"erro":err});

    }

}

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const { cargo, cpf, id, nome, telefone} = req.body;
        
        if (!cargo || !cpf || !id || !nome || !telefone) {
            res.json("Algum argumento está faltando");
            return;
        }

        if ((id === -1)) {
            adicionarFuncionario(req, res);
        } else {
            atualizarFuncionario(req, res);
        }

    } catch (err) {
        console.error(err);
        res.json({"erro":err});
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

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const { id } = req.body;

        const result = await pool.query(`
            DELETE FROM funcionario
            WHERE id = $1
            RETURNING *;
            `, 
            [id]);

        res.json(-1);


    } catch (err) {
        console.error(err);
        res.sendStatus(400).json({"erro":err});
    }
}