import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 3000;

(async function main () {
    app.use(express.static(path.join(__dirname, "..", "public")));

    app.get('/', function (req: Request, res: Response) {
        res.sendFile(path.join(__dirname, "..", "public", "html", "index.html"))
    })

    app.listen(PORT, function () {
        console.log(`# Server running on PORT: ${PORT}`)
    })
})()