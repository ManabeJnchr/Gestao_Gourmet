import express from 'express';

import views from './viewsRoutes';
import funcionario from './funcionarioRoutes';
import authentication from './authRoutes';
import mesa from './mesaRoutes';
import categoria from './categoriaRoutes';
import itemcardapio from './itemCardapioRoutes';
import pedidoRoutes from './pedidoRoutes';
import pagamento from './pagamentoRoutes';
import relatorio from './relatorioRoutes';

const router = express.Router();

export default (): express.Router => {
    views(router);
    funcionario(router);
    authentication(router);
    mesa(router);
    categoria(router);
    pedidoRoutes(router);
    itemcardapio(router);
    pagamento(router);
    relatorio(router);

    return router;
}