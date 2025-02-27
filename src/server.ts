import express, { Request, Response } from "express";
import path from "path";
import cors from 'cors';
import router from './routes/index';

const app = express();
const PORT = 3001;

(async function main () {
    app.use(cors());
    app.use(express.json());
    app.use(express.static("public"));

    app.use(router());

    app.get('/', function (req: Request, res: Response) {
        res.sendFile(path.join(__dirname, "..", "public", "html", "index.html"))
    })

    // app.get('/funcionarios', (req: express.Request, res: express.Response) => {
    //     res.sendFile(path.join(__dirname, "..", "public", "html", "gerenciarFuncionario.html"))
    // })

    // app.post('/addfuncionario', async (req: express.Request, res: express.Response) => {
    //     try {
    //         const { cargo, cpf, id_func, nome, telefone} = req.body
    //         if (!(id_func === -1)) {
    //             return;
    //         }

    //         // Inserir no banco de dados

    //         const cargo_id = 1;
    //         const result = await pool.query(`
    //             INSERT INTO funcionario (nome, cpf, cargo_id, telefone) 

    //             VALUES ($1, $2, $3, $4) RETURNING *
    //         `, [nome, cpf, cargo_id, telefone])

    //         // Retornar ao front-end
    //         res.json(result.rows[0]);

            

    //     } catch (err) {
    //         console.error(err);
    //         res.sendStatus(400).json({"message":err});
    //     }
    // })
    // app.get('/funcionario', async function (req: Request, res: Response) {
    //     try {
    //         const result = await pool.query('SELECT * FROM funcionario')
    //         res.json({success: true, time: result.rows})
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({success:false, error: 'Error connecting to database'})
    //     }
    // })
    app.listen(PORT, function () {
        console.log(`# Server running on PORT: ${PORT}`)
    })
})()