import express from 'express';

import views from './views';
import funcionario from './funcionarioRoutes';
import authentication from './auth';

const router = express.Router();

export default (): express.Router => {
    views(router);
    funcionario(router);
    authentication(router);

    return router;
}