import express from 'express';
import ItemCardapioService from '../services/ItemCardapioService';

export const salvarItemCardapio = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { nome, valor, id_categoria, descricao } = req.body;
        const imagem = req.file?.filename;

        if (!nome || !valor || !id_categoria || !descricao) {
            res.status(400).json({ error: "Faltam argumentos obrigatórios" });
            return;
        }
        const result = await ItemCardapioService.salvarItemCardapio({
            nome,
            valor,
            id_categoria,
            descricao,
            imagem,
            adicionais: [],
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar item do cardápio" });
    }
};

export const listarCardapio = async (req: express.Request, res: express.Response) => {
    try {
        const cardapio = await ItemCardapioService.listarCardapio();
        res.json(cardapio.map(item => ({
            ...item,
            imagem: item.imagem ? `/uploads/${item.imagem}` : null
        })));
    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};

export const deletarItemCardapio = async (req: express.Request, res: express.Response) => {
    try {

        await ItemCardapioService.deletarItemCardapio(req.body)

        res.status(200).json(-1);

    } catch (err) {
        console.error(err);
        res.status(400).json({ "erro": err });
    }
};