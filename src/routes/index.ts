import express from 'express';

import views from './views';
import funcionario from './funcionarioRoutes';
import authentication from './auth';
import mesa from './mesaRoutes';

const router = express.Router();

export default (): express.Router => {
    views(router);
    funcionario(router);
    authentication(router);
    mesa(router);

    return router;
}