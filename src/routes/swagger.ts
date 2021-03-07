import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/api.json';

const router = Router();
router.use('/swagger-ui', swaggerUi.serve);
router.get('/swagger-ui', swaggerUi.setup(swaggerDocument));

export default router;
