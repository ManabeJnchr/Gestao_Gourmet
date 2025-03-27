import { Router } from 'express';
import { uploadFuncionario } from '../controllers/funcionarioController';

const routes = Router();

// Rota para upload de arquivos e salvar informações do funcionário
routes.post('/upload', uploadFuncionario);

export default routes;
