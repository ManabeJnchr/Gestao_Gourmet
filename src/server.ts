import express, { Request, Response } from "express";
import path from "path";
import cors from 'cors';
import router from './routes/index';
import routes from "./routes/upload";

const app = express();
const PORT = 3001;

(async function main () {
    app.use(cors());
    app.use(express.json());
    app.use(express.static("public"));

    // Configuração para servir arquivos estáticos
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    app.use(router());
    app.use(routes);

    app.get('/', function (req: Request, res: Response) {
        res.sendFile(path.join(__dirname, "..", "public", "html", "telaLogin.html"))
    })

    app.listen(PORT, function () {
        console.log(`# Server running on PORT: ${PORT}`)
    })
})()