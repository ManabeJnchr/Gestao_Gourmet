import express, { Request, Response } from "express";
import path from "path";
import pool from './database';
import cors from 'cors';
import router from './routes';
import initdb from './dbinit';

const app = express();
const PORT = 3001;

(async function main () {
    // app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(cors());
    app.use(express.json());
    app.use(router);

    // Inicia a base de dados:
    await initdb();

    app.get('/', function (req: Request, res: Response) {
        res.sendFile(path.join(__dirname, "..", "public", "html", "index.html"))
    })

    app.get('/testando', async function (req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT NOW()')
            res.json({success: true, time: result.rows[0]})
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false, error: 'Error connecting to database'})
        }
    
    })
    

    app.get('/funcionario', async function (req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT * FROM funcionario')
            res.json({success: true, time: result.rows})
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false, error: 'Error connecting to database'})
        }
    })
    app.listen(PORT, function () {
        console.log(`# Server running on PORT: ${PORT}`)
    })
})()