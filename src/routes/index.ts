import express from 'express';

import views from './viewsRoutes';
import funcionario from './funcionarioRoutes';
import authentication from './authRoutes';
import mesa from './mesaRoutes';
import categoria from './categoriaRoutes';
import itemcardapio from './itemCardapioRoutes';

const router = express.Router();

export default (): express.Router => {
    views(router);
    funcionario(router);
    authentication(router);
    mesa(router);
    categoria(router);
    itemcardapio(router);

    return router;
}