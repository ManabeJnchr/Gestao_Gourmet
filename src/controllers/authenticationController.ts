import express from 'express';
import AuthenticationService from '../services/AuthenticationService';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.login(req.body);

        res.cookie("AUTH-GESTAO-GOURMET", result, { domain: 'localhost', path: '/' });
        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        res.cookie("AUTH-GESTAO-GOURMET", "", {domain: 'localhost', path: '/', expires: new Date(0)})

        res.status(200).json({ success: true });

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const getIdentity = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.getIdentity(req.cookies["AUTH-GESTAO-GOURMET"]);

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const solicitarResetSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.solicitarResetSenha(req.body);

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const aceitarResetSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.aceitarResetSenha(req.body);

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const trocarSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.trocarSenha(req.body, req.cookies["AUTH-GESTAO-GOURMET"]);

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const listarSolicitacoesResetSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.listarSolicitacoesResetSenha();

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}


export const recusarResetSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.recusarResetSenha(req.body);

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

export const quantidadeSolicitacoesResetSenha = async (req: express.Request, res: express.Response) => {
    try {
        const result = await AuthenticationService.quantidadeSolicitacoesResetSenha();

        res.status(200).json(result);

    } catch (err : any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
        
    }
}

