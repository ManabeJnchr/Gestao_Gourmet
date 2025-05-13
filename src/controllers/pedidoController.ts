import express from 'express';
import PedidoService from '../services/PedidoService';


export const novoPedido = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PedidoService.novoPedido(req.body.pedido);

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const listarPedidos = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PedidoService.listarPedidos();
        
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Erro no controller: ", err);
        
        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }
        
        res.status(500).json({"erro": "Erro interno no servidor" })
    }
}

export const buscarPedidoMesa = async (req: express.Request, res: express.Response) => {
    try {
            const result = await PedidoService.buscarPedidoMesa(req.body);

            res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const adicionarItemPedido = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PedidoService.adicionarItemPedido({id_pedido:req.body.id_pedido || null}, req.body.item || null);
        
        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};

export const removerItemPedido = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PedidoService.removerItemPedido(req.body);

        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};
  
export const cancelarPedido = async (req: express.Request, res: express.Response) => {
    try {
        const result = await PedidoService.cancelarPedido(req.body);
        
        res.status(200).json(result)
    } catch (err: any) {
        console.error("Erro no controller: ", err);

        if (err.statusCode) {
            res.status(err.statusCode).json({ "erro": err.message})
            return;
        }

        res.status(500).json({"erro": "Erro interno no servidor" })
    }
};
