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

    app.listen(PORT, function () {
        console.log(`# Server running on PORT: ${PORT}`)
    })
})()