import express from 'express';
const router = express.Router();
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

// Import the specific routers
import coinbaseRouter from './coinbase';
import healthcheckRouter from './healthcheck';
import loanRouter from './loan';
import assetRouter from './asset';
import alertRouter from './alert';
import userRouter from './user';
import marketingRouter from './marketing';
import complianceRouter from './compliance';

// TODO separate these routes
// /exchange/coinbase/withdraw etc
router.use('/', coinbaseRouter);
router.use('/', healthcheckRouter);
// /loan ...
router.use('/', loanRouter);
// /asset ...
router.use('/', assetRouter);
// /alert ...
router.use('/', alertRouter);
// /user ...
router.use('/', userRouter);

router.use('/marketing', marketingRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/comp', complianceRouter);

module.exports = router;
