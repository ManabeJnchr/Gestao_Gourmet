import { Router } from "express"
import pool from "./database";

const router = Router();


// Teste listar funcionários
router.get("/funcionarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM funcionario");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error:"Erro ao buscar funcionários"})
    }
})

// Incluir novo funcionário
router.post("/funcionarios", async (req, res) => {
    try {
        // Receber formulário do front-end
        const { nome, cpf, cargo_id, telefone } = req.body;

        // Inserir no banco de dados
        const result = await pool.query(`
            INSERT INTO funcionario (nome, cpf, cargo_id, telefone) 

            VALUES ($1, $2, $3, $4) RETURNING *
        `, [nome, cpf, cargo_id, telefone])

        // Retornar ao front-end
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar funcionário"});
    }
})

export default router;