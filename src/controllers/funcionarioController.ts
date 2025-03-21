import express from 'express';
import pool from '../database'
import FuncionarioService from '../services/FuncionarioService';

export const salvarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const result : any = await FuncionarioService.salvarFuncionario(req.body);

        // res.status(200).json({mensagem:result.mensagem || "Operação realizada com sucesso", result:result.rows});
        res.status(200).json(result.rows);

    } catch (err: any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro interno no servidor. Por favor, tente novamente"})
    }
}

export const listarFuncionarios = async (req: express.Request, res: express.Response) => {
    try {
        const result : any = await FuncionarioService.listarFuncionarios();

        // res.status(200).json({mensagem:result.mensagem || "Operação realizada com sucesso", result});
        res.status(200).json(result);
    } catch (err: any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro ao listar funcionários. Por favor, tente novamente"})
    }
}

export const deletarFuncionario = async (req: express.Request, res: express.Response) => {
    try {
        const result : any = await FuncionarioService.deletarFuncionario(req.body)


        // res.status(200).json({mensagem:result.mensagem || "Operação realizada com sucesso", result:result.rows || []});
        res.status(200).json(result.rows);

    } catch (err: any) {
        res
        .status(err.statusCode || 500)
        .json({"erro": err.mensagem || "Erro ao deletar funcionário. Por favor, tente novamente"})
    }
}