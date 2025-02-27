import express from 'express';

import views from './views';
import funcionario from './funcionarioRoutes';

const router = express.Router();

export default (): express.Router => {
    views(router);
    funcionario(router);

    return router;
}